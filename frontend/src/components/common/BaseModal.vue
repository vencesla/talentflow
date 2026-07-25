<!-- src/components/common/BaseModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop fade show"></div>
    <div v-if="isOpen" class="modal d-block" tabindex="-1" @click.self="close">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="close"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  title: string;
}>();

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>
