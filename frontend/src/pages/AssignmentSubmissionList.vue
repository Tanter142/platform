<template>
	<header
		class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-3 py-2.5 sm:px-5"
	>
		<Breadcrumbs :items="breadcrumbs" />
	</header>
	<div class="md:w-3/4 md:mx-auto py-5 mx-5">
		<div class="grid grid-cols-3 gap-5 mb-5">
			<Link
				doctype="LMS Assignment"
				v-model="assignmentID"
				:placeholder="__('Задание')"
			/>
			<Link doctype="User" v-model="member" :placeholder="__('Пользователь')" />
			<FormControl
				v-model="status"
				type="select"
				:options="statusOptions"
				:placeholder="__('Статус')"
			/>
		</div>
		<ListView
			v-if="submissions.loading || submissions.data?.length"
			:columns="submissionColumns"
			:rows="submissions.data"
			rowKey="name"
		>
			<ListHeader
				class="mb-2 grid items-center space-x-4 rounded bg-gray-100 p-2"
			>
				<ListHeaderItem :item="item" v-for="item in submissionColumns" />
			</ListHeader>
			<ListRows>
				<router-link
					v-for="row in submissions.data"
					:to="{
						name: 'AssignmentSubmission',
						params: {
							assignmentID: row.assignment,
							submissionName: row.name,
						},
					}"
				>
					<ListRow :row="row">
						<template #default="{ column, item }">
							<ListRowItem :item="row[column.key]" :align="column.align">
								<div v-if="column.key == 'status'">
									<Badge :theme="getStatusTheme(row[column.key])">
										{{ row[column.key] }}
									</Badge>
								</div>
								<div v-else>
									{{ row[column.key] }}
								</div>
							</ListRowItem>
						</template>
					</ListRow>
				</router-link>
			</ListRows>
		</ListView>
		<div
			v-else
			class="text-center p-5 text-gray-600 mt-52 w-3/4 md:w-1/2 mx-auto space-y-2"
		>
			<Pencil class="size-8 mx-auto stroke-1 text-gray-500" />
			<div class="text-xl font-medium">
				{{ __('Нет представлений') }}
			</div>
			<div class="leading-5">
				{{ __('Это задание не представлено.') }}
			</div>
		</div>
	</div>
</template>
<script setup>
import {
	Badge,
	Breadcrumbs,
	createListResource,
	FormControl,
	ListView,
	ListHeader,
	ListHeaderItem,
	ListRows,
	ListRow,
	ListRowItem,
} from 'frappe-ui'
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Pencil } from 'lucide-vue-next'
import Link from '@/components/Controls/Link.vue'

const user = inject('$user')
const dayjs = inject('$dayjs')
const router = useRouter()
const assignmentID = ref('')
const member = ref('')
const status = ref('')

onMounted(() => {
	if (!user.data?.is_instructor && !user.data?.is_moderator) {
		router.push({ name: 'Courses' })
	}
	assignmentID.value = router.currentRoute.value.query.assignmentID
	member.value = router.currentRoute.value.query.member
	status.value = router.currentRoute.value.query.status
	reloadSubmissions()
})

const getAssignmentFilters = () => {
	let filters = {}
	if (assignmentID.value) {
		filters.assignment = assignmentID.value
	}
	if (member.value) {
		filters.member = member.value
	}
	if (status.value) {
		filters.status = status.value
	}
	return filters
}

const submissions = createListResource({
	doctype: 'LMS Assignment Submission',
	fields: [
		'name',
		'assignment',
		'assignment_title',
		'member_name',
		'creation',
		'status',
	],
	orderBy: 'creation desc',
	transform(data) {
		return data.map((row) => {
			return {
				...row,
				creation: dayjs(row.creation).fromNow(),
			}
		})
	},
})

// watch changes in assignmentID, member, and status and if changes in any then reload submissions. Also update the url query params for the same
watch([assignmentID, member, status], () => {
	router.push({
		query: {
			assignmentID: assignmentID.value,
			member: member.value,
			status: status.value,
		},
	})
	reloadSubmissions()
})

const reloadSubmissions = () => {
	submissions.update({
		filters: getAssignmentFilters(),
	})
	submissions.reload()
}

const submissionColumns = computed(() => {
	return [
		{
			label: 'Пользователь',
			key: 'member_name',
			width: 1,
		},
		{
			label: 'Задание',
			key: 'assignment_title',
			width: 2,
		},
		{
			label: 'Отправлено',
			key: 'creation',
			width: 1,
			align: 'left',
		},
		{
			label: 'Статус',
			key: 'status',
			width: 1,
			align: 'center',
		},
	]
})

const statusOptions = computed(() => {
	return [
		{ label: '', value: '' },
		{ label: 'Пройдено', value: 'Pass' },
		{ label: 'Провал', value: 'Fail' },
		{ label: 'Не оценено', value: 'Not Graded' },
	]
})

const getStatusTheme = (status) => {
	if (status === 'Pass') {
		return 'green'
	} else if (status === 'Not Graded') {
		return 'blue'
	} else {
		return 'red'
	}
}

const breadcrumbs = computed(() => {
	return [
		{
			label: 'Представление заданий',
		},
	]
})
</script>
