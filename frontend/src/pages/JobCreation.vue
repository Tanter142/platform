<template>
	<div class="">
		<header
			class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-3 py-2.5 sm:px-5"
		>
			<Breadcrumbs :items="breadcrumbs" />
			<Button variant="solid" @click="saveJob()">
				{{ __('Сохранить') }}
			</Button>
		</header>
		<div class="py-5">
			<div class="container border-b mb-4 pb-4">
				<div class="text-lg font-semibold mb-4">
					{{ __('Подробности о вакансии') }}
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<FormControl
							v-model="job.job_title"
							:label="__('Заголовок')"
							class="mb-4"
							:required="true"
						/>
						<FormControl
							v-model="job.location"
							:label="__('Местоположение')"
							:required="true"
						/>
					</div>
					<div>
						<FormControl
							v-model="job.type"
							:label="__('Тип')"
							type="select"
							:options="jobTypes"
							class="mb-4"
							:required="true"
						/>
						<FormControl
							v-model="job.status"
							:label="__('Статус')"
							type="select"
							:options="jobStatuses"
							:required="true"
						/>
					</div>
				</div>
				<div class="mt-4">
					<label class="block text-gray-600 text-xs mb-1">
						{{ __('Описание') }}
						<span class="text-red-500">*</span>
					</label>
					<TextEditor
						:content="job.description"
						@change="(val) => (job.description = val)"
						:editable="true"
						:fixedMenu="true"
						editorClass="prose-sm max-w-none border-b border-x bg-gray-100 rounded-b-md py-1 px-2 min-h-[7rem] mb-4"
					/>
				</div>
			</div>
			<div class="container mb-4 pb-4">
				<div class="text-lg font-semibold mb-4">
					{{ __('Сведения о компании') }}
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<FormControl
							v-model="job.company_name"
							:label="__('Название компании')"
							class="mb-4"
							:required="true"
						/>
						<FormControl
							v-model="job.company_website"
							:label="__('Сайт компании')"
							:required="true"
						/>
					</div>
					<div>
						<FormControl
							v-model="job.company_email_address"
							:label="__('Электронный адрес компании')"
							class="mb-4"
							:required="true"
						/>
						<label class="block text-gray-600 text-xs mb-1 mt-4">
							{{ __('Логотип компании') }}
							<span class="text-red-500">*</span>
						</label>
						<FileUploader
							v-if="!job.image"
							:fileTypes="['image/*']"
							:validateFile="validateFile"
							@success="(file) => saveImage(file)"
						>
							<template
								v-slot="{ file, progress, uploading, openFileSelector }"
							>
								<div class="mb-4">
									<Button @click="openFileSelector" :loading="uploading">
										{{
											uploading ? `Загрузка ${progress}%` : 'Загрузить изображение'
										}}
									</Button>
								</div>
							</template>
						</FileUploader>
						<div v-else class="">
							<div class="flex items-center">
								<div class="border rounded-md p-2 mr-2">
									<FileText class="h-5 w-5 stroke-1.5 text-gray-700" />
								</div>
								<div class="flex flex-col">
									<span>
										{{ job.image.file_name }}
									</span>
									<span class="text-sm text-gray-500 mt-1">
										{{ getFileSize(job.image.file_size) }}
									</span>
								</div>
								<X
									@click="removeImage()"
									class="bg-gray-200 rounded-md cursor-pointer stroke-1.5 w-5 h-5 p-1 ml-4"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import {
	Breadcrumbs,
	FormControl,
	createResource,
	Button,
	TextEditor,
	FileUploader,
} from 'frappe-ui'
import { computed, onMounted, reactive, inject } from 'vue'
import { FileText, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { getFileSize, showToast } from '../utils'

const user = inject('$user')
const router = useRouter()

const props = defineProps({
	jobName: {
		type: String,
		default: 'new',
	},
})

const newJob = createResource({
	url: 'frappe.client.insert',
	makeParams(values) {
		return {
			doc: {
				doctype: 'Job Opportunity',
				company_logo: job.image?.file_url,
				...job,
			},
		}
	},
})

const updateJob = createResource({
	url: 'frappe.client.set_value',
	makeParams(values) {
		return {
			doctype: 'Job Opportunity',
			name: props.jobName,
			fieldname: {
				company_logo: job.image.file_url,
				...job,
			},
		}
	},
})

const jobDetail = createResource({
	url: 'frappe.client.get',
	makeParams(values) {
		return {
			doctype: 'Job Opportunity',
			name: props.jobName,
		}
	},
	onSuccess(data) {
		Object.keys(data).forEach((key) => {
			if (Object.hasOwn(job, key)) job[key] = data[key]
		})
		if (data.company_logo) imageResource.reload({ image: data.company_logo })
	},
})

const imageResource = createResource({
	url: 'lms.lms.api.get_file_info',
	makeParams(values) {
		return {
			file_url: values.image,
		}
	},
	auto: false,
	onSuccess(data) {
		job.image = data
	},
})

const job = reactive({
	job_title: '',
	location: '',
	type: 'Full Time',
	status: 'Open',
	company_name: '',
	company_website: '',
	image: null,
	description: '',
	company_email_address: '',
})

onMounted(() => {
	if (!user.data) window.location.href = '/login'

	if (props.jobName != 'new') jobDetail.reload()
})

const saveJob = () => {
	if (jobDetail.data) {
		editJobDetails()
	} else {
		createNewJob()
	}
}

const createNewJob = () => {
	newJob.submit(
		{},
		{
			onSuccess(data) {
				router.push({
					name: 'JobDetail',
					params: {
						job: data.name,
					},
				})
			},
			onError(err) {
				showToast('Error', err.messages?.[0] || err, 'x')
			},
		}
	)
}

const editJobDetails = () => {
	updateJob.submit(
		{},
		{
			onSuccess(data) {
				router.push({
					name: 'JobDetail',
					params: {
						job: data.name,
					},
				})
			},
			onError(err) {
				showToast('Error', err.messages?.[0] || err, 'x')
			},
		}
	)
}

const saveImage = (file) => {
	job.image = file
}

const removeImage = () => {
	job.image = null
}

const validateFile = (file) => {
	let extension = file.name.split('.').pop().toLowerCase()
	if (!['jpg', 'jpeg', 'png'].includes(extension)) {
		return 'Only image file is allowed.'
	}
}

const jobTypes = computed(() => {
	const translations = {
	    "Полная занятость": "Full Time",
	    "Частичная занятость": "Part Time",
	    "Фриланс": "Freelance",
	    "Контракт": "Contract"
	}

	return [
		{ label: 'Полная занятость', value: translations["Полная занятость"] },
		{ label: 'Частичная занятость', value: translations["Частичная занятость"] },
		{ label: 'Контракт', value: translations["Контракт"] },
		{ label: 'Фриланс', value: translations["Фриланс"] },
	]
})

const jobStatuses = computed(() => {
	return [
		{ label: 'Открыта', value: 'Open' },
		{ label: 'Закрыта', value: 'Closed' },
	]
})

const breadcrumbs = computed(() => {
	let crumbs = [
		{
			label: 'Вакансии',
			route: { name: 'Jobs' },
		},
		{
			label: props.jobName == 'new' ? 'Новая вакансия' : 'Редактирование вакансии',
			route: { name: 'JobCreation' },
		},
	]
	return crumbs
})
</script>
