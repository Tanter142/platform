<template>
	<header
		class="sticky flex items-center justify-between top-0 z-10 border-b bg-white px-3 py-2.5 sm:px-5"
	>
		<Breadcrumbs :items="breadcrumbs" />
	</header>
	<div class="p-5 lg:w-3/4 mx-auto">
		<div
			class="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 justify-between mb-5"
		>
			<div class="text-lg font-semibold">
				{{ __('Все сертифицированные участники') }}
			</div>
			<div class="grid grid-cols-2 gap-2">
				<FormControl
					v-model="nameFilter"
					:placeholder="__('Поиск по имени')"
					type="text"
					class="min-w-40 lg:min-w-0 lg:w-32 xl:w-40"
					@input="updateParticipants()"
				/>
				<div
					v-if="categories.data?.length"
					class="min-w-40 lg:min-w-0 lg:w-32 xl:w-40"
				>
					<Select
						v-model="currentCategory"
						:options="categories.data"
						:placeholder="__('Категории')"
						@change="updateParticipants()"
					/>
				</div>
			</div>
		</div>
		<div v-if="participants.data?.length">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				<router-link
					v-for="participant in participants.data"
					:to="{
						name: 'ProfileCertificates',
						params: { username: participant.username },
					}"
				>
					<div
						class="flex items-center space-x-2 border rounded-md hover:bg-gray-50 p-2"
					>
						<Avatar
							:image="participant.user_image"
							:label="participant.full_name"
							size="2xl"
						/>
						<div class="flex flex-col space-y-2">
							<div class="font-medium">
								{{ participant.full_name }}
							</div>
							<div
								v-if="participant.headline"
								class="headline text-sm text-gray-700"
							>
								{{ participant.headline }}
							</div>
						</div>
					</div>
				</router-link>
			</div>
			<div
				v-if="!participants.list.loading && participants.hasNextPage"
				class="flex justify-center mt-5"
			>
				<Button @click="participants.next()">
					{{ __('Load More') }}
				</Button>
			</div>
		</div>
		<div
			v-else-if="!participants.list.loading"
			class="flex flex-col items-center justify-center text-sm text-gray-600 italic mt-48"
		>
			<BookOpen class="size-10 mx-auto stroke-1 text-gray-500" />
			<div class="text-lg font-medium mb-1">
				{{ __('Участников не найдено') }}
			</div>
			<div class="leading-5 w-2/5 text-center">
				{{ __('Участников, подходящих под этот критерий, нет.') }}
			</div>
		</div>
	</div>
</template>
<script setup>
import {
	Avatar,
	Breadcrumbs,
	Button,
	createListResource,
	FormControl,
	Select,
} from 'frappe-ui'
import { computed, onMounted, ref } from 'vue'
import { updateDocumentTitle } from '@/utils'
import { BookOpen } from 'lucide-vue-next'

const currentCategory = ref('')
const filters = ref({})
const nameFilter = ref('')

onMounted(() => {
	updateParticipants()
})

const participants = createListResource({
	doctype: 'LMS Certificate',
	url: 'lms.lms.api.get_certified_participants',
	cache: ['certified_participants'],
	start: 0,
	pageLength: 30,
})

const categories = createListResource({
	doctype: 'LMS Certificate',
	url: 'lms.lms.api.get_certification_categories',
	cache: ['certification_categories'],
	auto: true,
	transform(data) {
		data.unshift({ label: __(''), value: '' })
		return data
	},
})

const updateParticipants = () => {
	updateFilters()
	participants.update({
		filters: filters.value,
	})
	participants.reload()
}

const updateFilters = () => {
	if (currentCategory.value) {
		filters.value.category = currentCategory.value
	} else {
		delete filters.value.category
	}

	if (nameFilter.value) {
		filters.value.member_name = ['like', `%${nameFilter.value}%`]
	} else {
		delete filters.value.member_name
	}
}

const breadcrumbs = computed(() => [
	{
		label: __('Сертифицированные участники'),
		route: { name: 'CertifiedParticipants' },
	},
])

const pageMeta = computed(() => {
	return {
		title: 'Сертифицированные участники',
		description: 'Все участники, прошедшие сертификацию.',
	}
})
updateDocumentTitle(pageMeta)
</script>
<style>
.headline {
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	text-overflow: ellipsis;
	width: 100%;
	overflow: hidden;
}
</style>
