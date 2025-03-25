<template>
	<div class="bg-[#151515] p-4 rounded-lg">
		<div class="mb-4 flex justify-between items-center">
			<div class="text-[#AAAAAA] mb-2">Unit</div>
			<div class="flex">
				<button
					@click="switchUnit('%')"
					class="px-4 py-2 rounded-l"
					:class="
						unit === '%'
							? 'bg-[#424242] text-[#F9F9F9]'
							: 'bg-[#212121] text-[#AAAAAA]'
					"
				>
					%
				</button>
				<button
					@click="switchUnit('px')"
					class="px-4 py-2 rounded-r"
					:class="
						unit === 'px'
							? 'bg-[#424242] text-[#F9F9F9]'
							: 'bg-[#212121] text-[#AAAAAA]'
					"
				>
					px
				</button>
			</div>
		</div>

		<div class="flex justify-between items-center">
			<div class="text-[#AAAAAA] mb-2">Value</div>
			<div
				class="relative flex items-center rounded width-50"
				:class="[
					isHovering ? 'bg-[#424242]' : 'bg-[#212121]',
					isFocused ? 'border border-[#3C67FF] rounded' : '',
				]"
			>
				<button
					@click="decrementValue"
					class="px-3 py-2 z-1"
					:disabled="shouldDisableDecrement"
					:class="
						shouldDisableDecrement
							? 'text-[#3B3B3B] cursor-not-allowed'
							: 'text-[#F9F9F9] hover:bg-[#424242]'
					"
				>
					<span class="text-xl">−</span>
				</button>
				<input
					v-model="inputValue"
					@blur="handleBlur"
					@focus="handleFocus"
					@mouseenter="isHovering = true"
					@mouseleave="isHovering = false"
					@keyup="handleChange"
					type="text"
					class="text-[#F9F9F9] text-center w-16 outline-none z-1"
					:class="[isHovering ? 'bg-[#424242]' : 'bg-[#212121]']"
				/>
				<button
					@click="incrementValue"
					class="px-3 py-2 z-1"
					:disabled="shouldDisableIncrement"
					:class="
						shouldDisableIncrement
							? 'text-[#3B3B3B] cursor-not-allowed'
							: 'text-[#F9F9F9] hover:bg-[#424242]'
					"
				>
					<span class="text-xl">+</span>
				</button>

				<!-- Tooltip -->
				<div
					class="tooltip mt-2 bg-[#212121] text-[#F9F9F9] text-sm px-3 py-1 rounded z-0"
					:class="[
						isShowTooltip ? 'showing' : 'closing',
						tooltipPosition === 'left'
							? 'left-[-55%]'
							: 'right-[-55%]',
					]"
				>
					{{ tooltipMessage }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const value = ref(1);
const unit = ref("%");
const inputValue = ref("1");
const isFocused = ref(false);
const isHovering = ref(false);
const isShowTooltip = ref(false);
const tooltipMessage = ref("");
const tooltipTimeout = ref<any>(0);
const tooltipPosition = ref("center"); // left, center, right

// Validation and button disabling logic
const shouldDisableDecrement = computed(() => {
	return value.value <= 0;
});

const shouldDisableIncrement = computed(() => {
	return unit.value === "%" && value.value >= 100;
});

// Helper functions for validation
function sanitizeInput(input: string): string {
	// Replace comma with period
	let sanitized = input.replace(",", ".");

	// Remove all non-numeric characters except one period and negative
	let hasPeriod = false;
	let hasNegative = false;
	let result = "";

	for (let i = 0; i < sanitized.length; i++) {
		const char = sanitized[i];
		if (char === "." && !hasPeriod) {
			hasPeriod = true;
			result += char;
		} else if (char === "-" && !hasNegative) {
			hasNegative = true;
			result += char;
		} else if (/[0-9]/.test(char)) {
			result += char;
		}
	}

	return result;
}

// Event handlers
function handleFocus() {
	isFocused.value = true;
}

function handleBlur() {
	isFocused.value = false;

	// If input is empty or less than 0, reset to 0
	if (!inputValue.value || parseFloat(inputValue.value) < 0) {
		inputValue.value = "0";
		value.value = 0;
		showTooltip("Value must greater than 0");
		tooltipPosition.value = "left";
		return;
	}

	const sanitized = sanitizeInput(inputValue.value);
	const parsedValue = parseFloat(sanitized);

	// Validation for percentage values
	if (unit.value === "%") {
		if (parsedValue > 100) {
			value.value = 100;
			inputValue.value = "100";
			showTooltip("Value must smaller than 100");
			tooltipPosition.value = "right";
		} else {
			value.value = parsedValue;
			inputValue.value = sanitized;
		}
	} else {
		value.value = parsedValue;
		inputValue.value = sanitized;
	}
}

function handleChange() {
	const sanitized = sanitizeInput(inputValue.value);
	const parsedValue = parseFloat(sanitized);
	value.value = parsedValue;
	inputValue.value = sanitized;
}

function incrementValue() {
	if (unit.value === "%" && value.value >= 100) return;

	value.value += 1;
	inputValue.value = value.value.toString();
}

function decrementValue() {
	if (value.value <= 0) return;

	value.value -= 1;
	inputValue.value = value.value.toString();
}

function switchUnit(newUnit: string) {
	if (unit.value === newUnit) return;

	// If switching from px to % and value > 100, update to 100
	if (newUnit === "%" && value.value > 100) {
		value.value = 100;
		inputValue.value = "100";
	}

	unit.value = newUnit;
}

// Show tooltip
function showTooltip(message: string) {
	clearTimeout(tooltipTimeout.value);
	tooltipMessage.value = message;
	isShowTooltip.value = true;

	tooltipTimeout.value = setTimeout(() => {
		isShowTooltip.value = false;
	}, 5000);
}
</script>

<style>
/* style for tooltip element when don't want the class to be too long */
.tooltip {
	width: fit-content;
	position: absolute;
	top: 0;
	opacity: 0;
	transition: all ease 0.2s;
	white-space: nowrap;
	z-index: 0;
}

.tooltip.closing {
	top: 0;
	opacity: 0;
}

.tooltip.showing {
	top: calc(-100% - 8px);
	opacity: 1;
}

.tooltip::before {
	content: "";
	position: absolute;
	bottom: -7px;
	left: 50%;
	height: 7px;
	width: 7px;
	transform: rotate(45deg) translateX(-50%);
	background-color: var(--color-gray-800);
}
</style>
