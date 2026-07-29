<template>
  <div class="row g-3">
    <!-- Adresse complète -->
    <div class="col-12 text-start">
      <label for="address" class="form-label">Adresse rue</label>
      <input
        id="address"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.address }"
        v-model="modelValue.address"
      />
      <div v-if="errors.address" class="invalid-feedback">
        {{ errors.address }}
      </div>
    </div>

    <!-- Code Postal -->
    <div class="col-md-4 text-start">
      <label for="zipCode" class="form-label">Code Postal</label>
      <input
        id="zipCode"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.zipCode }"
        v-model="modelValue.zipCode"
      />
      <div v-if="errors.zipCode" class="invalid-feedback">
        {{ errors.zipCode }}
      </div>
    </div>

    <!-- Ville -->
    <div class="col-md-4 text-start">
      <label for="city" class="form-label">Ville</label>
      <input
        id="city"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.city }"
        v-model="modelValue.city"
      />
      <div v-if="errors.city" class="invalid-feedback">{{ errors.city }}</div>
    </div>

    <!-- Pays -->
    <div class="col-md-4 text-start">
      <label for="country" class="form-label">Pays</label>
      <input
        id="country"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.country }"
        v-model="modelValue.country"
      />
      <div v-if="errors.country" class="invalid-feedback">
        {{ errors.country }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { updateCompanyType } from "@/schemas/company.schema";

defineProps<{
  errors: Record<string, string>;
}>();

const modelValue = defineModel<updateCompanyType>({ required: true });
</script>
