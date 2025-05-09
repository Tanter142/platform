<template>
	<header
		class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-3 py-2.5 sm:px-5"
	>
		<Breadcrumbs v-if="submisisonDetails.doc" :items="breadcrumbs" />
		<div class="space-x-2">
			<Badge
				v-if="submisisonDetails.isDirty"
				:label="__('Not Saved')"
				variant="subtle"
				theme="orange"
			/>
			<Button variant="solid" @click="saveSubmission()">
				{{ __('Save') }}
			</Button>
		</div>
	</header>
	<div v-if="submisisonDetails.doc" class="w-1/2 mx-auto py-5 space-y-5">
		<div class="text-xl font-semibold">
			{{ submisisonDetails.doc.member_name }}
		</div>
		<div class="space-y-4 border p-5 rounded-md">
			<div class="grid grid-cols-2 gap-5">
				<FormControl
					v-model="submisisonDetails.doc.quiz_title"
					:label="__('Quiz')"
					:disabled="true"
				/>
				<FormControl
					v-model="submisisonDetails.doc.member_name"
					:label="__('Member')"
					:disabled="true"
				/>
			</div>

			<div class="grid grid-cols-2 gap-5">
				<FormControl
					v-model="submisisonDetails.doc.score"
					:label="__('Score')"
					:disabled="true"
				/>
				<FormControl
					v-model="submisisonDetails.doc.percentage"
					:label="__('Percentage')"
					:disabled="true"
				/>
			</div>
		</div>

		<div
			v-for="row in submisisonDetails.doc.result"
			class="border p-5 rounded-md space-y-4"
		>
			<div class="flex space-x-1 font-semibold">
				<span class="leading-5" v-html="row.question"> </span>
			</div>
			<div v-html="row.answer" class="leading-5"></div>
			<div class="grid grid-cols-2 gap-5">
				<FormControl v-model="row.marks" :label="__('Marks')" />
				<FormControl
					v-model="row.marks_out_of"
					:label="__('Marks out of')"
					:disabled="true"
				/>
			</div>
		</div>
	</div>
</template>
<script setup>
import {
	createDocumentResource,
	Breadcrumbs,
	FormControl,
	Button,
	Badge,
} from 'frappe-ui'
import { computed, onBeforeUnmount, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '@/utils'

const router = useRouter()
const user = inject('$user')

onMounted(() => {
	if (!user.data?.is_instructor && !user.data?.is_moderator)
		router.push({ name: 'Courses' })

	window.addEventListener('keydown', keyboardShortcut)
})

onBeforeUnmount(() => {
	window.removeEventListener('keydown', keyboardShortcut)
})

const keyboardShortcut = (e) => {
	if (
		e.key === 's' &&
		(e.ctrlKey || e.metaKey) &&
		!e.target.classList.contains('ProseMirror')
	) {
		saveSubmission()
		e.preventDefault()
	}
}

const props = defineProps({
	submission: {
		type: String,
		required: true,
	},
})

const submisisonDetails = createDocumentResource({
	doctype: 'LMS Quiz Submission',
	name: props.submission,
	auto: true,
})

const breadcrumbs = computed(() => {
	return [
		{
			label: __('Представление теста'),
			route: {
				name: 'QuizSubmissionList',
				params: {
					quizID: submisisonDetails.doc.quiz,
				},
			},
		},
		{
			label: submisisonDetails.doc.quiz_title,
		},
	]
})

const saveSubmission = () => {
	submisisonDetails.save.submit(
		{},
		{
			onError(err) {
				showToast(__(''), __(err.messages?.[0] || err), 'x')
			},
		}
	)
}
</script>
