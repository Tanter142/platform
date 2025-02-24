import { createRouter, createWebHistory } from 'vue-router'
import { usersStore } from './stores/user'
import { sessionStore } from './stores/session'
import { useSettings } from './stores/settings'

let defaultRoute = '/курсы'
const routes = [
	{
		path: '/',
		redirect: {
			name: 'Courses',
		},
	},
	{
		path: '/курсы',
		name: 'Курсы',
		component: () => import('@/pages/Courses.vue'),
	},
	{
		path: '/курсы/:courseName',
		name: 'Детали курса',
		component: () => import('@/pages/CourseDetail.vue'),
		props: true,
	},
	{
		path: '/курсы/:courseName/изучение/:chapterNumber-:lessonNumber',
		name: 'Уроки',
		component: () => import('@/pages/Lesson.vue'),
		props: true,
	},
	{
		path: '/курсы/:courseName/изучение/:chapterName',
		name: 'SCORMChapter',
		component: () => import('@/pages/SCORMChapter.vue'),
		props: true,
	},
	{
		path: '/группы',
		name: 'Группы',
		component: () => import('@/pages/Batches.vue'),
	},
	{
		path: '/группы/детали/:batchName',
		name: 'BatchDetail',
		component: () => import('@/pages/BatchDetail.vue'),
		props: true,
	},
	{
		path: '/группы/:batchName',
		name: 'Batch',
		component: () => import('@/pages/Batch.vue'),
		props: true,
	},
	{
		path: '/оплата/:type/:name',
		name: 'Billing',
		component: () => import('@/pages/Billing.vue'),
		props: true,
	},
	{
		path: '/статистика',
		name: 'Statistics',
		component: () => import('@/pages/Statistics.vue'),
	},
	{
		path: '/пользователь/:username',
		name: 'Profile',
		component: () => import('@/pages/Profile.vue'),
		props: true,
		redirect: { name: 'ProfileAbout' },
		children: [
			{
				name: 'ProfileAbout',
				path: '',
				component: () => import('@/pages/ProfileAbout.vue'),
			},
			{
				name: 'ProfileCertificates',
				path: 'сертификаты',
				component: () => import('@/pages/ProfileCertificates.vue'),
			},
			{
				name: 'ProfileRoles',
				path: 'роли',
				component: () => import('@/pages/ProfileRoles.vue'),
			},
			{
				name: 'ProfileEvaluator',
				path: 'слоты',
				component: () => import('@/pages/ProfileEvaluator.vue'),
			},
			{
				name: 'ProfileEvaluationSchedule',
				path: 'расписание',
				component: () =>
					import('@/pages/ProfileEvaluationSchedule.vue'),
			},
		],
	},
	{
		path: '/вакансии',
		name: 'Jobs',
		component: () => import('@/pages/Jobs.vue'),
	},
	{
		path: '/вакансии/:job',
		name: 'JobDetail',
		component: () => import('@/pages/JobDetail.vue'),
		props: true,
	},
	{
		path: '/курсы/:courseName/редактировать',
		name: 'Форма курса',
		component: () => import('@/pages/CourseForm.vue'),
		props: true,
	},
	{
		path: '/курсы/:courseName/изучение/:chapterNumber-:lessonNumber/редактировать',
		name: 'LessonForm',
		component: () => import('@/pages/LessonForm.vue'),
		props: true,
	},
	{
		path: '/группы/:batchName/редактировать',
		name: 'BatchForm',
		component: () => import('@/pages/BatchForm.vue'),
		props: true,
	},
	{
		path: '/вакансия/:jobName/редактировать',
		name: 'JobCreation',
		component: () => import('@/pages/JobCreation.vue'),
		props: true,
	},
	{
		path: '/сертифицированные-участники',
		name: 'CertifiedParticipants',
		component: () => import('@/pages/CertifiedParticipants.vue'),
	},
	{
		path: '/уведомления',
		name: 'Notifications',
		component: () => import('@/pages/Notifications.vue'),
	},
	{
		path: '/значки/:badgeName/:email',
		name: 'Badge',
		component: () => import('@/pages/Badge.vue'),
		props: true,
	},
	{
		path: '/викторины',
		name: 'Quizzes',
		component: () => import('@/pages/Quizzes.vue'),
	},
	{
		path: '/викторины/:quizID',
		name: 'QuizForm',
		component: () => import('@/pages/QuizForm.vue'),
		props: true,
	},
	{
		path: '/викторина/:quizID',
		name: 'QuizPage',
		component: () => import('@/pages/QuizPage.vue'),
		props: true,
	},
	{
		path: '/викторина-подтверждения/:quizID',
		name: 'QuizSubmissionList',
		component: () => import('@/pages/QuizSubmissionList.vue'),
		props: true,
	},
	{
		path: '/викторина-подтверждение/:submission',
		name: 'QuizSubmission',
		component: () => import('@/pages/QuizSubmission.vue'),
		props: true,
	},
	{
		path: '/программы/:programName',
		name: 'ProgramForm',
		component: () => import('@/pages/ProgramForm.vue'),
		props: true,
	},
	{
		path: '/программы',
		name: 'Programs',
		component: () => import('@/pages/Programs.vue'),
	},
	{
		path: '/задания',
		name: 'Assignments',
		component: () => import('@/pages/Assignments.vue'),
	},
	{
		path: '/задания/:assignmentID',
		name: 'AssignmentForm',
		component: () => import('@/pages/AssignmentForm.vue'),
		props: true,
	},
	{
		path: '/задание-подтверждение/:assignmentID/:submissionName',
		name: 'AssignmentSubmission',
		component: () => import('@/pages/AssignmentSubmission.vue'),
		props: true,
	},
	{
		path: '/задание-подтверждения',
		name: 'AssignmentSubmissionList',
		component: () => import('@/pages/AssignmentSubmissionList.vue'),
	},
]

let router = createRouter({
	history: createWebHistory('/lms'),
	routes,
})

router.beforeEach(async (to, from, next) => {
	const { userResource } = usersStore()
	const { isLoggedIn } = sessionStore()
	const { allowGuestAccess } = useSettings()

	try {
		if (isLoggedIn) {
			await userResource.promise
		}
	} catch (error) {
		isLoggedIn = false
	}

	if (!isLoggedIn) {
		await allowGuestAccess.promise
		if (!allowGuestAccess.data) {
			window.location.href = '/login'
			return
		}
	}
	return next()
})

export default router


