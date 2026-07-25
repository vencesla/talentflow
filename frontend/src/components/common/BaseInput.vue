<!-- src/components/common/BaseInput.vue -->
<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['form-control', { 'is-invalid border-red-500': error }]"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <div v-if="error" class="invalid-feedback text-red-500 text-sm mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string | number | null;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  id?: string;
}>();

defineEmits(["update:modelValue"]);
</script>
