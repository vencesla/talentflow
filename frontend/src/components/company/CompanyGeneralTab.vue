<template>
  <div class="row g-3">
    <!-- Nom de l'entreprise -->
    <div class="col-md-6 text-start">
      <label for="companyName" class="form-label">Nom de l'entreprise *</label>
      <input
        id="companyName"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.name }"
        v-model="modelValue.name"
      />
      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
    </div>

    <!-- SIRET -->
    <div class="col-md-6 text-start">
      <label for="siret" class="form-label">Numéro SIRET</label>
      <input
        id="siret"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.siret }"
        v-model="modelValue.siret"
        placeholder="14 chiffres"
        maxlength="14"
      />
      <div v-if="errors.siret" class="invalid-feedback">{{ errors.siret }}</div>
    </div>

    <!-- Secteur d'activité -->
    <div class="col-md-6 text-start">
      <label for="industry" class="form-label">Secteur d'activité</label>
      <input
        id="industry"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.industry }"
        v-model="modelValue.industry"
      />
      <div v-if="errors.industry" class="invalid-feedback">
        {{ errors.industry }}
      </div>
    </div>

    <!-- Site web (Utiliser type="text" pour laisser Zod gérer la validation) -->
    <div class="col-md-6 text-start">
      <label for="website" class="form-label">Site Web</label>
      <input
        id="website"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.website }"
        v-model="modelValue.website"
      />
      <div v-if="errors.website" class="invalid-feedback">
        {{ errors.website }}
      </div>
    </div>

    <!-- URL du logo (Corrigé: type="text" et errors.logoUrl) -->
    <div class="col-12 text-start">
      <label for="logo" class="form-label">URL du Logo</label>
      <input
        id="logo"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.logoUrl }"
        v-model="modelValue.logoUrl"
      />
      <div v-if="errors.logoUrl" class="invalid-feedback">
        {{ errors.logoUrl }}
      </div>
    </div>

    <!-- Description -->
    <div class="col-12 text-start">
      <label for="description" class="form-label"
        >Description de l'entreprise</label
      >
      <textarea
        id="description"
        class="form-control"
        :class="{ 'is-invalid': errors.description }"
        v-model="modelValue.description"
        rows="4"
        placeholder="Présentez votre entreprise..."
      ></textarea>
      <div v-if="errors.description" class="invalid-feedback">
        {{ errors.description }}
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
