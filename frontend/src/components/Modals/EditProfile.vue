<template>
	<Dialog
		:options="{
			title: 'Отредактируйте свой профиль',
			size: 'xl',
			actions: [
				{
					label: 'Cохранить',
					variant: 'solid',
					onClick: (close) => saveProfile(close),
				},
			],
		}"
	>
		<template #body-content>
			<div>
				<FileUploader
					v-if="!profile.image"
					:fileTypes="['image/*']"
					:validateFile="validateFile"
					@success="(file) => saveImage(file)"
				>
					<template v-slot="{ file, progress, uploading, openFileSelector }">
						<div class="mb-4">
							<Button @click="openFileSelector" :loading="uploading">
								{{
									uploading
										? `Загрузка ${progress}%`
										: 'Загрузите изображение профиля'
								}}
							</Button>
						</div>
					</template>
				</FileUploader>
				<div v-else class="mb-4">
					<div class="text-xs text-gray-600 mb-1">
						{{ __('Изображение профиля') }}
					</div>
					<div class="flex items-center">
						<div class="border rounded-md p-2 mr-2">
							<FileText class="h-5 w-5 stroke-1.5 text-gray-700" />
						</div>
						<div class="text-base flex flex-col">
							<span>
								{{ profile.image.file_name }}
							</span>
							<span class="text-sm text-gray-500 mt-1">
								{{ getFileSize(profile.image.file_size) }}
							</span>
						</div>
						<X
							@click="removeImage()"
							class="bg-gray-200 rounded-md cursor-pointer stroke-1.5 w-5 h-5 p-1 ml-4"
						/>
					</div>
				</div>
				<FormControl
					v-model="profile.first_name"
					:label="__('Имя')"
					class="mb-4"
				/>
				<FormControl
					v-model="profile.last_name"
					:label="__('Фамилия')"
					class="mb-4"
				/>
				<FormControl
					v-model="profile.headline"
					:label="__('Сноска')"
					class="mb-4"
				/>

				<div class="mb-4">
					<div class="mb-1.5 text-sm text-gray-600">
						{{ __('Описание') }}
					</div>
					<TextEditor
						:fixedMenu="true"
						@change="(val) => profile.bio = val.trim() === '<p></p>' ? '' : val"
						:content="profile.bio"
						editorClass="prose-sm py-2 px-2 min-h-[200px] border-gray-300 hover:border-gray-400 rounded-md bg-gray-200"
					/>
				</div>
			</div>
		</template>
	</Dialog>
</template>
<script setup>
import {
	Dialog,
	FormControl,
	FileUploader,
	Button,
	createResource,
	TextEditor,
} from 'frappe-ui'
import { reactive, watch, defineModel } from 'vue'
import { FileText, X } from 'lucide-vue-next'
import { getFileSize, showToast, escapeHTML } from '@/utils'

const reloadProfile = defineModel('reloadProfile')

const props = defineProps({
	profile: {
		type: Object,
		required: true,
	},
})

const profile = reactive({
	first_name: '',
	last_name: '',
	headline: '',
	bio: '',
	image: '',
})
console.log(props.profile.data)
const imageResource = createResource({
	url: 'lms.lms.api.get_file_info',
	makeParams(values) {
		return {
			file_url: values.image,
		}
	},
	auto: false,
	onSuccess(data) {
		profile.image = data
	},
})

const updateProfile = createResource({
	url: 'frappe.client.set_value',
	makeParams() {
		return {
			doctype: 'User',
			name: props.profile.data.name,
			fieldname: {
				user_image: profile.image?.file_url,
				first_name: profile.first_name,
				last_name: profile.last_name,
				headline: profile.headline,
				bio: profile.bio,
			},
		}
	},
	onSuccess(data) {
		props.profile.data = data
	},
})

const saveProfile = (close) => {
	updateProfile.submit(
		{},
		{
			onSuccess() {
				close()
				reloadProfile.value.reload()
			},
			onError(err) {
				showToast('', err.messages?.[0] || err, 'x')
			},
		}
	)
}

const validateFile = (file) => {
	let extension = file.name.split('.').pop().toLowerCase()
	if (!['jpg', 'jpeg', 'png'].includes(extension)) {
		return 'Разрешены только изображения.'
	}
}

const saveImage = (file) => {
	profile.image = file
}

const removeImage = () => {
	profile.image = null
}

watch(
	() => props.profile.data,
	(newVal) => {
		if (newVal) {
			profile.first_name = newVal.first_name
			profile.last_name = newVal.last_name
			profile.headline = newVal.headline
			profile.bio = newVal.bio
			if (newVal.user_image) imageResource.submit({ image: newVal.user_image })
		}
	}
)
</script>

