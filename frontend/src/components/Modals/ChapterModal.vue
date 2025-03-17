<template>
	<Dialog
		v-model="show"
		:options="{
			title: chapterDetail ? __('Редактировать главу') : __('Добавить главу'),
			size: 'lg',
			actions: [
				{
					label: chapterDetail ? __('Редактировать') : __('Создать'),
					variant: 'solid',
					onClick: (close) =>
						chapterDetail ? editChapter(close) : addChapter(close),
				},
			],
		}"
	>
		<template #body-content>
			<div class="space-y-4 text-base">
				<FormControl label="Название" v-model="chapter.title" :required="true" />
				<Switch
					size="sm"
					:label="__('Пакет SCORM')"
					:description="
						__(
							'Включите это только в том случае, если вы хотите загрузить пакет SCORM в виде главы.'
						)
					"
					v-model="chapter.is_scorm_package"
				/>
				<div v-if="chapter.is_scorm_package">
					<FileUploader
						v-if="!chapter.scorm_package"
						:fileTypes="['.zip']"
						:validateFile="validateFile"
						@success="(file) => (chapter.scorm_package = file)"
					>
						<template v-slot="{ file, progress, uploading, openFileSelector }">
							<div class="mb-4">
								<Button @click="openFileSelector" :loading="uploading">
									{{
										uploading ? `Uploading ${progress}%` : 'Загрузить zip-файл'
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
									{{ chapter.scorm_package.file_name }}
								</span>
								<span class="text-sm text-gray-500 mt-1">
									{{ getFileSize(chapter.scorm_package.file_size) }}
								</span>
							</div>
							<X
								@click="() => (chapter.scorm_package = null)"
								class="bg-gray-200 rounded-md cursor-pointer stroke-1.5 w-5 h-5 p-1 ml-4"
							/>
						</div>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import {
	Button,
	createResource,
	Dialog,
	FileUploader,
	FormControl,
	Switch,
} from 'frappe-ui'
import { defineModel, reactive, watch } from 'vue'
import { showToast, getFileSize } from '@/utils/'
import { capture } from '@/telemetry'
import { FileText, X } from 'lucide-vue-next'
import { useSettings } from '@/stores/settings'

const show = defineModel()
const outline = defineModel('outline')
const settingsStore = useSettings()

const props = defineProps({
	course: {
		type: String,
		required: true,
	},
	chapterDetail: {
		type: Object,
	},
})

const chapter = reactive({
	title: '',
	is_scorm_package: 0,
	scorm_package: null,
})

const chapterResource = createResource({
	url: 'lms.lms.api.upsert_chapter',
	makeParams(values) {
		return {
			title: chapter.title,
			course: props.course,
			is_scorm_package: chapter.is_scorm_package,
			scorm_package: chapter.scorm_package,
			name: props.chapterDetail?.name,
		}
	},
})

const chapterReference = createResource({
	url: 'frappe.client.insert',
	makeParams(values) {
		return {
			doc: {
				doctype: 'Chapter Reference',
				chapter: values.name,
				parent: props.course,
				parenttype: 'LMS Course',
				parentfield: 'chapters',
			},
		}
	},
})

const addChapter = async (close) => {
	chapterResource.submit(
		{},
		{
			validate() {
				return validateChapter()
			},
			onSuccess: (data) => {
				capture('chapter_created')
				chapterReference.submit(
					{ name: data.name },
					{
						onSuccess(data) {
							cleanChapter()
							/* if (!settingsStore.onboardingDetails.data?.is_onboarded) {
								settingsStore.onboardingDetails.reload()
							} */
							outline.value.reload()
							showToast(
								__(''),
								__('Глава добавлена успешно'),
								'check'
							)
						},
						onError(err) {
							showToast(__(''), err.messages?.[0] || err, 'x')
						},
					}
				)
				close()
			},
			onError(err) {
				showToast(__(''), err.messages?.[0] || err, 'x')
			},
		}
	)
}

const validateChapter = () => {
	if (!chapter.title) {
		return __('Название обязательно')
	}
	if (chapter.is_scorm_package && !chapter.scorm_package) {
		return __('Пожалуйста, загрузите пакет SCORM')
	}
}

const cleanChapter = () => {
	chapter.title = ''
	chapter.is_scorm_package = 0
	chapter.scorm_package = null
}

const editChapter = (close) => {
	chapterResource.submit(
		{},
		{
			validate() {
				if (!chapter.title) {
					return 'Название обязательно'
				}
			},
			onSuccess() {
				outline.value.reload()
				showToast(__(''), __('Глава успешно обновлена'), 'check')
				close()
			},
			onError(err) {
				showToast(__(''), err.messages?.[0] || err, 'x')
			},
		}
	)
}

watch(
	() => props.chapterDetail,
	(newChapter) => {
		chapter.title = newChapter?.title
		chapter.is_scorm_package = newChapter?.is_scorm_package
		chapter.scorm_package = newChapter?.scorm_package
	}
)

const validateFile = (file) => {
	let extension = file.name.split('.').pop().toLowerCase()
	if (extension !== 'zip') {
		return __('Разрешено использовать только zip-файлы')
	}
}
</script>
