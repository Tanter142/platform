<template>
	<div class="space-y-5">
		<div class="space-y-2">
			<div class="flex items-center text-sm font-medium space-x-2">
				<span>
					{{ __('Что означает включить в предварительный просмотр?') }}
				</span>
			</div>
			<div class="text-xs text-gray-600 mb-1 leading-5">
				{{
					__(
						'Если для урока включено включение в предварительный просмотр, то урок также будет доступен для пользователей, не вошедших в систему.'
					)
				}}
			</div>
		</div>

		<div class="space-y-2">
			<div
				class="flex items-center text-sm font-medium space-x-2 cursor-pointer"
				@click="openHelpDialog('quiz')"
			>
				<span>
					{{ __('Как добавить тест?') }}
				</span>
				<Info class="w-3 h-3 text-gray-700" />
			</div>
			<div class="text-xs text-gray-600 mb-1 leading-5">
				{{
					__(
						'Нажмите на значок "Добавить" в редакторе и выберите "Тест" в меню. Откроется диалоговое окно, в котором вы можете либо выбрать тест из списка, либо создать новый тест. При выборе опции "Создать новый" вы будете перенаправлены на страницу создания теста.'
					)
				}}
			</div>
		</div>

		<div class="space-y-2">
			<div
				class="flex text-sm font-medium space-x-2 cursor-pointer"
				@click="openHelpDialog('upload')"
			>
				<span class="leading-5">
					{{ __(contentMap['upload']) }}
				</span>
				<Info class="w-3 h-3 text-gray-700" />
			</div>
			<div class="text-xs text-gray-600 mb-1 leading-5">
				{{
					__(
						'Чтобы загрузить изображение, видео, аудио или PDF из вашей системы, нажмите на значок "Добавить" и выберите "Загрузить" в меню. Затем выберите файл, который вы хотите добавить к уроку, и он будет добавлен к вашему уроку.'
					)
				}}
			</div>
		</div>

		<div class="space-y-2">
			<div
				class="flex items-center text-sm font-medium space-x-2 cursor-pointer"
				@click="openHelpDialog('youtube')"
			>
				<span>
					{{ __(contentMap['youtube']) }}
				</span>
				<Info class="w-3 h-3 text-gray-700" />
			</div>
			<div class="text-xs text-gray-600 mb-1 leading-5">
				{{
					__(
						'Скопируйте URL-адрес видео с YouTube и вставьте его в редактор.'
					)
				}}
			</div>
		</div>
	</div>
	<ExplanationVideos v-model="showExplanation" :title="title" :type="type" />
</template>
<script setup>
import { Info } from 'lucide-vue-next'
import { ref } from 'vue'
import ExplanationVideos from '@/components/Modals/ExplanationVideos.vue'

const showExplanation = ref(false)
const type = ref(null)
const title = ref(null)
const contentMap = {
	quiz: 'Как добавить тест?',
	upload: 'Как загрузить контент из вашей системы?',
	youtube: 'Как добавить YouTube видео?',
}

const openHelpDialog = (contentType) => {
	type.value = contentType
	title.value = contentMap[contentType]
	showExplanation.value = true
}
</script>
