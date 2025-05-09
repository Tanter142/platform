<template>
	<header
		class="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-3 py-2.5 sm:px-5"
	>
		<Breadcrumbs :items="breadbrumbs" />
		<Button
			v-if="user.data?.is_moderator || user.data?.is_instructor"
			@click="showDialog = true"
			variant="solid"
			class="save-button"
		>
			<template #prefix>
				<Plus class="h-4 w-4 stroke-1.5" />
			</template>
			{{ __('Добавить') }}
		</Button>
	</header>
	<div v-if="programs.data?.length" class="pt-5 px-5">
		<div v-for="program in programs.data" class="mb-10">
			<div class="flex items-center justify-between">
				<div class="text-xl font-semibold">
					{{ program.name }}
				</div>
				<div class="flex items-center space-x-2">
					<Badge
						v-if="program.members"
						variant="subtle"
						theme="green"
						size="lg"
					>
						{{ program.members }}
						{{ program.members == 1 ? __('Участник') : __('Участников') }}
					</Badge>
					<Badge
						v-if="program.progress"
						variant="subtle"
						theme="blue"
						size="lg"
					>
						{{ program.progress }}{{ __('% completed') }}
					</Badge>

					<router-link
						v-if="user.data?.is_moderator || user.data?.is_instructor"
						:to="{
							name: 'ProgramForm',
							params: { programName: program.name },
						}"
					>
						<Button>
							<template #prefix>
								<Edit class="h-4 w-4 stroke-1.5" />
							</template>
							{{ __('Редактировать') }}
						</Button>
					</router-link>
				</div>
			</div>
			<div
				v-if="program.courses?.length"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5"
			>
				<div v-for="course in program.courses" class="relative group">
					<CourseCard
						:course="course"
						@click="enrollMember(program.name, course.name)"
						class="cursor-pointer"
					/>
					<div
						v-if="lockCourse(course)"
						class="absolute inset-0 bg-black-overlay-500 opacity-60 rounded-md"
					></div>
					<div
						v-if="lockCourse(course)"
						class="absolute inset-0 flex items-center justify-center"
					>
						<LockKeyhole class="size-10 text-white" />
					</div>
				</div>
			</div>
			<div v-else class="text-sm italic text-gray-600 mt-4">
				{{ __('Нет курсов в этой программе') }}
			</div>
		</div>
	</div>
	<div
		v-else
		class="text-center p-5 text-gray-600 mt-52 w-3/4 md:w-1/2 mx-auto space-y-2"
	>
		<BookOpen class="size-10 mx-auto stroke-1 text-gray-500" />
		<div class="text-xl font-medium">
			{{ __('Программы не найдены') }}
		</div>
		<div class="leading-5">
			{{
				__(
					'На данный момент нет доступных программ. Следите за новостями, скоро появятся новые возможности для обучения!'
				)
			}}
		</div>
	</div>

	<Dialog
		v-model="showDialog"
		:options="{
			title: __('Новая программа'),
			actions: [
				{
					label: __('Создать'),
					variant: 'solid',
					onClick: () => createProgram(close),
					class: 'save-button bg-blue-600 hover:bg-blue-700',
				},
			],
		}"
	>
		<template #body-content>
			<FormControl :label="__('Название')" v-model="title" />
		</template>
	</Dialog>
</template>
<script setup>
import {
	Badge,
	Breadcrumbs,
	Button,
	call,
	createResource,
	Dialog,
	FormControl,
} from 'frappe-ui'
import { computed, inject, onMounted, ref } from 'vue'
import { BookOpen, Edit, Plus, LockKeyhole } from 'lucide-vue-next'
import CourseCard from '@/components/CourseCard.vue'
import { useRouter } from 'vue-router'
import { showToast } from '@/utils'
import { useSettings } from '@/stores/settings'

const user = inject('$user')
const showDialog = ref(false)
const router = useRouter()
const title = ref('')
const settings = useSettings()

onMounted(() => {
	if (
		!settings.learningPaths.data &&
		!user.data?.is_moderator &&
		!user.data?.is_instructor
	) {
		router.push({ name: 'Courses' })
	}
})

const programs = createResource({
	url: 'lms.lms.utils.get_programs',
	auto: true,
	cache: 'programs',
})

const createProgram = (close) => {
	call('frappe.client.insert', {
		doc: {
			doctype: 'LMS Program',
			title: title.value,
		},
	}).then((res) => {
		router.push({ name: 'ProgramForm', params: { programName: res.name } })
	})
}

const enrollMember = (program, course) => {
	call('lms.lms.utils.enroll_in_program_course', {
		program: program,
		course: course,
	})
		.then((data) => {
			if (data.current_lesson) {
				router.push({
					name: 'Lesson',
					params: {
						courseName: course,
						chapterNumber: data.current_lesson.split('-')[0],
						lessonNumber: data.current_lesson.split('-')[1],
					},
				})
			} else if (data) {
				router.push({
					name: 'Lesson',
					params: {
						courseName: course,
						chapterNumber: 1,
						lessonNumber: 1,
					},
				})
			}
		})
		.catch((err) => {
			showToast('', err.messages?.[0] || err, 'x')
		})
}

const lockCourse = (course) => {
	if (user.data?.is_moderator || user.data?.is_instructor) return false
	if (course.membership) return false
	if (course.eligible) return false
	return true
}

const breadbrumbs = computed(() => [
	{
		label: 'Программы',
	},
])
</script>
<style scoped>
.save-button {
	background-color: #5a5cff !important;
	color: white !important;
}
.save-button:hover {
	background-color: #3f3fff !important;
}
</style>
