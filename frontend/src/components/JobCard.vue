<template>
	<div class="flex space-x-4 border rounded-md p-2">
		<Avatar :image="job.company_logo" :label="job.job_title" size="2xl" />
		<div class="flex flex-col space-y-2 flex-1">
			<div class="flex items-center justify-between">
				<span class="font-semibold">
					{{ job.job_title }}
				</span>
			</div>
			<div class="flex items-center space-x-2">
				<Building2 class="w-4 h-4 stroke-1.5 text-gray-600" />
				<span>
					{{ job.company_name }}
				</span>
			</div>
			<div class="flex items-center space-x-2">
				<MapPin class="w-4 h-4 stroke-1.5 text-gray-600" />
				<span>
					{{ job.location }}
				</span>
			</div>
			<div class="flex items-center space-x-2">
				<Shapes class="w-4 h-4 stroke-1.5 text-gray-600" />
				<span>
					{{ translatedJobType  }}
				</span>
			</div>
			<div class="flex items-center space-x-2">
				<Calendar class="w-4 h-4 stroke-1.5 text-gray-600" />
				<span> {{ __('Опубликовано') }} {{ dayjs(job.creation).fromNow() }} </span>
			</div>
		</div>
	</div>
</template>
<script setup>
import { Building2, Calendar, MapPin, Shapes } from 'lucide-vue-next'
import { inject, computed  } from 'vue'
import { Avatar } from 'frappe-ui'
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime);
dayjs.locale('ru');



const props = defineProps({
	job: {
		type: Object,
		default: null,
	},
})

const translations = {
  "Full Time": "Полная занятость",
  "Part Time": "Частичная занятость",
  "Freelance": "Фриланс",
  "Contract": "Контракт"
};

const translatedJobType = computed(() => {
  return translations[props.job?.type] || props.job?.type;
});
</script>
