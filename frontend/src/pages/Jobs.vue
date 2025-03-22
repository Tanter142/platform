<template>
	<div class="">
		<header
			class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-3 py-2.5 sm:px-5"
		>
			<Breadcrumbs
				class="h-7"
				:items="[{ label: __('Вакансии'), route: { name: 'Jobs' } }]"
			/>
			<router-link
				v-if="user.data?.name"
				:to="{
					name: 'JobCreation',
					params: {
						jobName: 'new',
					},
				}"
			>
				<Button variant="solid">
					<template #prefix>
						<Plus class="h-4 w-4" />
					</template>
					{{ __('Добавить вакансию') }}
				</Button>
			</router-link>
		</header>
		<div>
			<div class="lg:w-3/4 mx-auto p-5">
				<div
					class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:items-center justify-between mb-5"
				>
					<div class="text-xl font-semibold">
						{{ __('Найдите идеальную работу для себя') }}
					</div>
					<div class="grid grid-cols-2 gap-2">
						<FormControl
							type="text"
							:placeholder="__('Поиск')"
							v-model="searchQuery"
							class="min-w-40 lg:min-w-0 lg:w-32 xl:w-40"
							@input="updateJobs"
						>
							<template #prefix>
								<Search
									class="w-4 h-4 stroke-1.5 text-gray-600"
									name="search"
								/>
							</template>
						</FormControl>
						<FormControl
							v-model="jobType"
							type="select"
							:options="jobTypes"
							class="min-w-40 lg:min-w-0 lg:w-32 xl:w-40"
							:placeholder="__('Тип')"
							@change="updateJobs"
						/>
					</div>
				</div>

				<div
					v-if="jobs.data?.length"
					class="grid grid-cols-1 lg:grid-cols-2 gap-5"
				>
					<router-link
						v-for="job in jobs.data"
						:to="{
							name: 'JobDetail',
							params: { job: job.name },
						}"
						:key="job.name"
					>
						<JobCard :job="job" />
					</router-link>
				</div>
				<div v-else class="text-gray-700 italic p-5 w-fit mx-auto">
					{{ __('Нет вакансий') }}
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { Button, Breadcrumbs, createResource, FormControl } from 'frappe-ui'
import { Plus, Search } from 'lucide-vue-next'
import { inject, computed, ref, onMounted } from 'vue'
import JobCard from '@/components/JobCard.vue'
import { updateDocumentTitle } from '@/utils'

const user = inject('$user')
const jobType = ref(null)
const searchQuery = ref('')
const filters = ref({})
const orFilters = ref({})

onMounted(() => {
	let queries = new URLSearchParams(location.search)
	if (queries.has('type')) {
		jobType.value = queries.get('type')
	}
	updateJobs()
})

const jobs = createResource({
	url: 'lms.lms.api.get_job_opportunities',
	cache: ['jobs'],
})

const updateJobs = () => {
	updateFilters()
	jobs.update({
		params: {
			filters: filters.value,
			orFilters: orFilters.value,
		},
	})
	jobs.reload()
}
console.log(jobs)
const updateFilters = () => {
	filters.value.status = 'Open'
	filters.value.disabled = 0

	if (jobType.value) {
		filters.value.type = jobType.value
	} else {
		delete filters.value.type
	}

	if (searchQuery.value) {
		orFilters.value = {
			job_title: ['like', `%${searchQuery.value}%`],
			company_name: ['like', `%${searchQuery.value}%`],
			location: ['like', `%${searchQuery.value}%`],
		}
	} else {
		orFilters.value = {}
	}
}
console.log(filters)
const jobTypes = computed(() => {

return [
	'',
	{ label: 'Полная занятость', value: 'Полная занятость' },
	{ label: 'Частичная занятость', value: 'Частичная занятость' },
	{ label: 'Контракт', value: 'Контракт' },
	{ label: 'Фриланс', value: 'Фриланс' },
]
})
const pageMeta = computed(() => {
	return {
		title: 'Вакансии',
		description: 'Открытая доска объявлений для сообщества',
	}
})

updateDocumentTitle(pageMeta)
</script>
