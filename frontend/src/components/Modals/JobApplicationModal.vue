<template>
	<Dialog
		v-model="show"
		class="text-base"
		:options="{
			title: __('Подать заявку'),
			size: 'lg',
			actions: [
				{
					label: 'Отправить',
					variant: 'solid',
					onClick: (close) => {
						submitResume(close)
					},
				},
			],
		}"
	>
		<template #body-content>
			<div class="flex flex-col gap-4">
				<p>
					{{
						__(
							'Отправьте свое резюме, чтобы продолжить рассмотрение заявки на эту должность. После отправки резюме оно будет размещено в объявлении о вакансии.'
						)
					}}
				</p>
				<div v-if="!resume">
					<FileUploader
						:fileTypes="['.pdf']"
						:validateFile="validateFile"
						@success="
							(file) => {
								resume = file
							}
						"
					>
						<template v-slot="{ file, progress, uploading, openFileSelector }">
							<div class="">
								<Button @click="openFileSelector" :loading="uploading">
									{{
										uploading ? `Загрузка ${progress}%` : 'Загрузите свое резюме'
									}}
								</Button>
							</div>
						</template>
					</FileUploader>
				</div>
				<div v-else class="flex items-center">
					<div class="border rounded-md p-2 mr-2">
						<FileText class="h-5 w-5 stroke-1.5 text-gray-700" />
					</div>
					<div class="flex flex-col">
						<span>
							{{ resume.file_name }}
						</span>
						<span class="text-sm text-gray-500 mt-1">
							{{ getFileSize(resume.file_size) }}
						</span>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import { Dialog, FileUploader, Button, createResource } from 'frappe-ui'
import { FileText } from 'lucide-vue-next'
import { ref, inject, defineModel } from 'vue'
import { createToast, getFileSize } from '@/utils/'

const resume = ref(null)
const show = defineModel()
const user = inject('$user')
const application = defineModel('application')

const props = defineProps({
	job: {
		type: String,
		required: true,
	},
})

const validateFile = (file) => {
	let extension = file.name.split('.').pop().toLowerCase()
	if (extension != 'pdf') {
		return 'Разрешен только PDF-файл'
	}
}

const jobApplication = createResource({
	url: 'frappe.client.insert',
	makeParams(values) {
		return {
			doc: {
				doctype: 'LMS Job Application',
				user: user.data?.name,
				resume: resume.value?.file_name,
				job: props.job,
			},
		}
	},
})

const submitResume = (close) => {
	jobApplication.submit(
		{},
		{
			validate() {
				if (!resume.value) {
					throw new Error('Пожалуйста, загрузите свое резюме')
				}
			},
			onSuccess() {
				createToast({
					title: '',
					text: 'Ваше заявление подано',
					icon: 'check',
					iconClasses: 'bg-green-600 text-white rounded-md p-px',
				})
				application.value.reload()
				close()
			},
			onError(err) {
				const errorMessage = err instanceof Error ? err.message : (err.messages?.[0] || err);
				createToast({
					title: '',
					text: `<span class="${
			icon == 'check' ? 'leading-[1.4]' : 'leading-[1.4]'
		}">${errorMessage}</span>` || 'Ошибка',
					icon: 'x',
					iconClasses: 'bg-red-600 text-white rounded-md p-px',
					position: 'top-center',
					timeout: 10,
					textClasses: 'leading-[1.4]',
				})
			},
		}
	)
}
</script>
