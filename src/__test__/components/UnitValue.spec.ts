import { mount } from "@vue/test-utils";
import UnitValue from "../../components/UnitValue.vue";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("UnitValueComponent", () => {
	let wrapper: any;

	beforeEach(() => {
		wrapper = mount(UnitValue);
	});

	afterEach(() => {
		wrapper.unmount();
	});

	it("should render correctly", () => {
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find("div").exists()).toBe(true);
		expect(wrapper.html()).toMatchSnapshot();
	});

	it("should switch units on button click", async () => {
		const unitButtons = wrapper.findAll("button");

		expect(wrapper.vm.unit).toBe("%");

		await unitButtons[1].trigger("click"); // Click 'px' button
		expect(wrapper.vm.unit).toBe("px");

		await unitButtons[0].trigger("click"); // Click '%' button
		expect(wrapper.vm.unit).toBe("%");
	});

	it('should increment value on "+" button click', async () => {
		const incrementButton = wrapper.find("button:last-of-type");
		expect(wrapper.vm.value).toBe(1);

		await incrementButton.trigger("click");
		expect(wrapper.vm.value).toBe(2);
	});

	it('should decrement value on "-" button click', async () => {
		const decrementButton = wrapper.find("button:first-of-type");
		expect(wrapper.vm.value).toBe(1);

		await decrementButton.trigger("click");
		expect(wrapper.vm.value).toBe(0);

		// Test if the value doesn't go below 0
		await decrementButton.trigger("click");
		expect(wrapper.vm.value).toBe(0);
	});

	it("should show tooltip for invalid input on blur", async () => {
		const input = wrapper.find("input");

		await input.setValue("-5");
		await input.trigger("blur");

		expect(wrapper.vm.tooltipMessage).toBe("Value must greater than 0");
		expect(wrapper.find(".tooltip").text()).toContain(
			"Value must greater than 0"
		);
	});

	it("should not increment value beyond 100 when unit is %", async () => {
		const incrementButton = wrapper.find("button:last-of-type");

		await wrapper.setData({ unit: "%", value: 100 });

		await incrementButton.trigger("click");
		expect(wrapper.vm.value).toBe(100); // Value should not increase beyond 100
	});

	it("should not decrement value below 0", async () => {
		const decrementButton = wrapper.find("button:first-of-type");

		await wrapper.setData({ value: 0 });
		await decrementButton.trigger("click");

		expect(wrapper.vm.value).toBe(0); // Value should not go below 0
	});

	it("should disable increment button when value is 100 and unit is %", async () => {
		const incrementButton = wrapper.find("button:last-of-type");

		await wrapper.setData({ unit: "%", value: 100 });
		expect(incrementButton.attributes("disabled")).toBe("disabled");
	});

	it("should disable decrement button when value is 0", async () => {
		const decrementButton = wrapper.find("button:first-of-type");

		await wrapper.setData({ value: 0 });
		expect(decrementButton.attributes("disabled")).toBe("disabled");
	});
});
