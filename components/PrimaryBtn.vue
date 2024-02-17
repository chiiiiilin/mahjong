<template>
	<UButton
		:icon="props.icon"
		size="lg"
		color="emerald"
		variant="solid"
		:label="props.label"
		:trailing="false"
        class="primary-btn"
		@click="props.onClick"
	/>
</template>

<script setup>
const props = defineProps({
	label: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
	},
	onClick: Function,
});
</script>

<style lang="scss" scoped>
.primary-btn {
	padding: 10px 25px;
	margin: auto;
}
</style>
