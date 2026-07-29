<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
      <div class="modal-card">
        <!-- Header -->
        <div class="modal-header">
          <h3>
            {{
              isEditing
                ? "Modifier l'entreprise"
                : company?.name || "Fiche entreprise"
            }}
          </h3>
        </div>

        <!-- Alerte Erreur -->
        <div v-if="errorMessage" class="error-banner">
          {{ errorMessage }}
        </div>

        <!-- MODE LECTURE -->
        <div v-if="!isEditing" class="modal-body">
          <div v-if="company?.description" class="section">
            <h4>À propos</h4>
            <p>{{ company.description }}</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">SIRET :</span>
              <span class="value">{{ company?.siret || "Non renseigné" }}</span>
            </div>
            <div class="info-item">
              <span class="label">Secteur :</span>
              <span class="value">{{
                company?.industry || "Non renseigné"
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">Site web :</span>
              <span class="value">
                <a
                  v-if="company?.website"
                  :href="company.website"
                  target="_blank"
                  class="link"
                >
                  {{ company.website }}
                </a>
                <template v-else>Non renseigné</template>
              </span>
            </div>
            <div class="info-item">
              <span class="label">Adresse :</span>
              <span class="value">
                <template v-if="company?.address">
                  {{ company.address }}<br />
                  {{ company.zipCode }} {{ company.city }}
                </template>
                <template v-else>Non renseignée</template>
              </span>
            </div>
          </div>
        </div>

        <!-- MODE ÉDITION (Formulaire) -->
        <form v-else @submit.prevent="handleSave" class="modal-body edit-form">
          <div class="form-group">
            <label>Nom de l'entreprise *</label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="Ex: TechCorp"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>SIRET (14 chiffres)</label>
              <input
                v-model="formData.siret"
                type="text"
                maxlength="14"
                inputmode="numeric"
                placeholder="14 chiffres sans espaces"
                @input="formatSiret"
              />
              <span class="field-hint" v-if="formData.siret">
                {{ formData.siret.length }} / 14 caractères
              </span>
            </div>
            <div class="form-group">
              <label>Secteur d'activité</label>
              <input
                v-model="formData.industry"
                type="text"
                placeholder="Ex: Informatique"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Site Internet</label>
            <input
              v-model="formData.website"
              type="url"
              placeholder="https://exemple.fr"
            />
          </div>

          <div class="form-group">
            <label>Logo Entreprise</label>
            <input v-model="formData.logo" type="url" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              placeholder="Présentez votre entreprise..."
            ></textarea>
          </div>

          <div class="form-group">
            <label>Adresse</label>
            <input
              v-model="formData.address"
              type="text"
              placeholder="Numéro et rue"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Code Postal</label>
              <input
                v-model="formData.zipCode"
                type="text"
                placeholder="75000"
              />
            </div>
            <div class="form-group">
              <label>Ville</label>
              <input v-model="formData.city" type="text" placeholder="Paris" />
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="modal-footer">
          <!-- Actions Mode Lecture -->
          <template v-if="!isEditing">
            <button class="btn-secondary" @click="emit('close')">Fermer</button>
            <button class="btn-primary" @click="isEditing = true">
              Modifier les informations
            </button>
          </template>

          <!-- Actions Mode Édition -->
          <template v-else>
            <button
              class="btn-secondary"
              :disabled="isSaving"
              @click="isEditing = false"
            >
              Annuler
            </button>
            <button
              class="btn-primary"
              :disabled="isSaving"
              @click="handleSave"
            >
              {{ isSaving ? "Enregistrement..." : "Enregistrer" }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { companyType } from "@/schemas/company.schema";
import { useCompanyStore } from "@/stores/companyStore";
import "@/assets/css/modal.recru.css";

const props = defineProps<{
  isOpen: boolean;
  company: companyType | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const companyStore = useCompanyStore();

// État d'affichage : lecture ou édition
const isEditing = ref(false);
const isSaving = ref(false);
const errorMessage = ref<string | null>(null);

// Formulaire réactif initialisé avec des valeurs par défaut
const formData = ref<Partial<companyType>>({});

// Remplit le formulaire à l'ouverture de la modal ou au changement d'entreprise
watch(
  () => [props.isOpen, props.company],
  ([open]) => {
    if (open) {
      isEditing.value = false;
      errorMessage.value = null;
      initFormData();
    }
  },
  { immediate: true },
);

function initFormData() {
  formData.value = {
    name: props.company?.name || "",
    siret: props.company?.siret || "",
    industry: props.company?.industry || "",
    website: props.company?.website || "",
    description: props.company?.description || "",
    address: props.company?.address || "",
    city: props.company?.city || "",
    zipCode: props.company?.zipCode || "",
    country: props.company?.country || "France",
    logo: props.company?.logo || "",
  };
}

function formatSiret(event: Event) {
  const target = event.target as HTMLInputElement;
  formData.value.siret = target.value.replace(/\D/g, "").slice(0, 14);
}
async function handleSave() {
  isSaving.value = true;
  errorMessage.value = null;

  // Sauvegarde via le store Pinia
  const result = await companyStore.saveCompany(formData.value as companyType);

  isSaving.value = false;

  if (result) {
    isEditing.value = false; // Retour en mode lecture après succès
  } else {
    errorMessage.value = companyStore.error || "Erreur lors de la sauvegarde.";
  }
}
</script>
