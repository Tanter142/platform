<template>
	<header
		class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-3 py-2.5 sm:px-5"
	>
		<Breadcrumbs :items="breadcrumbs" />
		<div class="space-x-2">
			<router-link
				v-if="assignment.doc?.name"
				:to="{
					name: 'AssignmentSubmissionList',
					query: {
						assignmentID: assignment.doc.name,
					},
				}"
			>
				<Button>
					{{ __('Список материалов') }}
				</Button>
			</router-link>
			<Button variant="solid" @click="saveAssignment()">
				{{ __('Cохранить') }}
			</Button>
		</div>
	</header>
	<div class="w-3/4 mx-auto py-5">
		<div class="font-semibold mb-4">
			{{ __('Добавить задание') }}
		</div>
		<div class="grid grid-cols-2 gap-5 mt-4 mb-8">
			<FormControl
				v-model="model.title"
				:label="__('Название задания')"
				:required="true"
			/>
			<FormControl
				v-model="model.type"
				type="select"
				:options="assignmentOptions"
				:label="__('Тип задания')"
				:required="true"
			/>
		</div>
		<div>
			<div class="text-xs text-gray-600 mb-2">
				{{ __('Вопрос') }}
				<span class="text-ink-red-3">*</span>
			</div>
			<TextEditor
				:content="model.question"
				@change="(val) => (model.question = val)"
				:editable="true"
				:fixedMenu="true"
				editorClass="prose-sm max-w-none border-b border-x bg-gray-100 rounded-b-md py-1 px-2 min-h-[7rem]"
			/>
		</div>
	</div>
</template>
<script setup>
import {
	Breadcrumbs,
	Button,
	createDocumentResource,
	createResource,
	FormControl,
	TextEditor,
} from 'frappe-ui'
import {
	computed,
	inject,
	onMounted,
	onBeforeUnmount,
	reactive,
	watch,
} from 'vue'
import { showToast } from '@/utils'
import { useRouter } from 'vue-router'

const user = inject('$user')
const router = useRouter()

const props = defineProps({
	assignmentID: {
		type: String,
		required: true,
	},
})

const model = reactive({
	title: '',
	type: 'PDF',
	question: '',
})

onMounted(() => {
	if (
		props.assignmentID == 'new' &&
		!user.data?.is_moderator &&
		!user.data?.is_instructor
	) {
		router.push({ name: 'Courses' })
	}
	if (props.assignmentID !== 'new') {
		assignment.reload()
	}
	window.addEventListener('keydown', keyboardShortcut)
})

const keyboardShortcut = (e) => {
	if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
		saveAssignment()
		e.preventDefault()
	}
}

onBeforeUnmount(() => {
	window.removeEventListener('keydown', keyboardShortcut)
})

const assignment = createDocumentResource({
	doctype: 'LMS Assignment',
	name: props.assignmentID,
	auto: false,
})

const newAssignment = createResource({
	url: 'frappe.client.insert',
	makeParams(values) {
		return {
			doc: {
				doctype: 'LMS Assignment',
				...values,
			},
		}
	},
	onSuccess(data) {
		router.push({ name: 'AssignmentForm', params: { assignmentID: data.name } })
		showToast(__(''), __('Задание успешно создано'), 'check')
	},
	onError(err) {
		showToast(__(''), __(err.messages?.[0] || err), 'x')
	},
})

const saveAssignment = () => {
	if (props.assignmentID == 'new') {
		newAssignment.submit({
			...model,
		})
	} else {
		assignment.setValue.submit(
			{
				...model,
			},
			{
				onSuccess(data) {
					showToast(__(''), __('Задание успешно сохранено'), 'check')
					assignment.reload()
				},
				onError(err) {
					showToast(__(''), __(err.messages?.[0] || err), 'x')
				},
			}
		)
	}
}

watch(assignment, () => {
	Object.keys(assignment.doc).forEach((key) => {
		model[key] = assignment.doc[key]
	})
})

const breadcrumbs = computed(() => [
	{
		label: __('Задания'),
		route: { name: 'Assignments' },
	},
	{
		label: assignment.doc ? assignment.doc.title : __('Новое задание'),
	},
])

const assignmentOptions = computed(() => {
	return [
		{ label: 'PDF', value: 'PDF' },
		{ label: 'Изображение', value: 'Image' },
		{ label: 'Документ', value: 'Document' },
		{ label: 'Текст', value: 'Text' },
		{ label: 'Ссылка', value: 'URL' },
	]
})
</script>
