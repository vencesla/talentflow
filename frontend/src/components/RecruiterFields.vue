<script setup lang="ts">
defineProps<{
  companyName: string;
  companyWebsite: string;
  errors: Record<string, string>;
}>();

defineEmits<{
  (e: "update:companyName", value: string): void;
  (e: "update:companyWebsite", value: string): void;
}>();
</script>

<template>
  <!-- Nom de l'entreprise -->
  <div class="col-12 text-start">
    <label class="form-label">Nom de l'entreprise *</label>
    <input
      :value="companyName"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': errors.companyName }"
      @input="
        $emit('update:companyName', ($event.target as HTMLInputElement).value)
      "
    />
    <div v-if="errors.companyName" class="invalid-feedback">
      {{ errors.companyName }}
    </div>
  </div>

  <!-- Site Web (Optionnel) -->
  <div class="col-12 text-start">
    <label class="form-label">
      Site Web <span class="text-muted fw-normal">(optionnel)</span>
    </label>
    <input
      :value="companyWebsite"
      type="url"
      class="form-control"
      :class="{ 'is-invalid': errors.companyWebsite }"
      @input="
        $emit(
          'update:companyWebsite',
          ($event.target as HTMLInputElement).value,
        )
      "
    />
    <div v-if="errors.companyWebsite" class="invalid-feedback">
      {{ errors.companyWebsite }}
    </div>
  </div>
</template>
