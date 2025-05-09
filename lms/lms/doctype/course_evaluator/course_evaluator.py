# Copyright (c) 2022, Frappe and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
from lms.lms.utils import get_evaluator
from datetime import datetime
from frappe.utils import get_time, getdate


class CourseEvaluator(Document):
	def validate(self):
		self.validate_time_slots()
		self.validate_unavailability()

	def validate_unavailability(self):
		if (
			self.unavailable_from
			and self.unavailable_to
			and getdate(self.unavailable_from) >= getdate(self.unavailable_to)
		):
			frappe.throw(_("Дата начала не может быть больше даты окончания"))

	def validate_time_slots(self):
		for schedule in self.schedule:
			if get_time(schedule.start_time) >= get_time(schedule.end_time):
				frappe.throw(_("Время начала не может быть больше времени окончания"))

			self.validate_overlaps(schedule)

	def validate_overlaps(self, schedule):
		same_day_slots = list(
			filter(lambda x: x.day == schedule.day and x.name != schedule.name, self.schedule)
		)
		overlap = False

		for slot in same_day_slots:
			if (
				get_time(schedule.start_time)
				<= get_time(slot.start_time)
				< get_time(schedule.end_time)
			):
				overlap = True
			if (
				get_time(schedule.start_time)
				< get_time(slot.end_time)
				<= get_time(schedule.end_time)
			):
				overlap = True
			if get_time(slot.start_time) < get_time(schedule.start_time) and get_time(
				schedule.end_time
			) < get_time(slot.end_time):
				overlap = True

			if overlap:
				frappe.throw(_("Данный интервал времени пересекается с другим"))


@frappe.whitelist()
def get_schedule(course, date, batch=None):
	evaluator = get_evaluator(course, batch)
	day = datetime.strptime(date, "%Y-%m-%d").strftime("%A")

	all_slots = frappe.get_all(
		"Evaluator Schedule",
		filters={
			"parent": evaluator,
			"day": day,
		},
		fields=["day", "start_time", "end_time"],
		order_by="start_time",
	)

	booked_slots = frappe.get_all(
		"LMS Certificate Request",
		filters={"evaluator": evaluator, "date": date},
		fields=["start_time", "day"],
	)

	for slot in booked_slots:
		same_slot = list(
			filter(lambda x: x.start_time == slot.start_time and x.day == slot.day, all_slots)
		)
		if len(same_slot):
			all_slots.remove(same_slot[0])

	return all_slots
