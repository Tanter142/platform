<template>
	<Assignment
		v-if="user.data && submission.data"
		:assignmentID="assignmentID"
		:submissionName="submission.data?.name || 'new'"
	/>
	<div v-else class="border rounded-md text-center py-20">
		<div>
			{{ __('Пожалуйста, авторизуйтесь, чтобы получить доступ к заданию.') }}
		</div>
		<Button @click="redirectToLogin()" class="mt-2">
			<span>
				{{ __('Авторизоваться') }}
			</span>
		</Button>
	</div>
</template>
<script setup>
import { inject, watch } from 'vue'
import { Button, createResource } from 'frappe-ui'
import Assignment from '@/components/Assignment.vue'

const user = inject('$user')

const props = defineProps({
	assignmentID: {
		type: String,
		required: true,
	},
})

const submission = createResource({
	url: 'frappe.client.get_value',
	makeParams(values) {
		return {
			doctype: 'LMS Assignment Submission',
			fieldname: 'name',
			filters: {
				assignment: props.assignmentID,
				member: user.data?.name,
			},
		}
	},
	auto: true,
})
</script>
