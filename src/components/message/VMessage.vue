<script lang="ts" setup>
  import { ref } from 'vue';
  import type { VMessageInstance, VMessageOptions, VMessageType } from './types';
  import type { IconName } from '../../icons';
  import VIcon from '@/components/icon/VIcon.vue';

  const messages = ref<VMessageInstance[]>([]);
  let messageId: number = 0;

  const getIcon = (type: VMessageType): IconName => {
    const icons = {
      success: 'checkCircle',
      danger: 'alertCircle',
      warning: 'alertTriangle',
      primary: 'infoCircle',
    };

    return (icons[type] || 'infoCircle') as IconName;
  };

  const addMessage = (options: VMessageOptions): number => {
    const id = ++messageId;
    const message: VMessageInstance = {
      id,
      message: options.message || '',
      title: options.title || null,
      type: options.type || 'primary',
      showClose: options.showClose || false,
      duration: options.duration !== undefined ? options.duration : 3000,
      dangerouslyUseHTMLString: options.dangerouslyUseHTMLString || false,
    };

    messages.value.push(message);

    if (message.duration && message.duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, message.duration);
    }

    return id;
  };

  const removeMessage = (id: number): void => {
    const index = messages.value.findIndex(msg => msg.id === id);
    if (index > -1) {
      messages.value.splice(index, 1);
    }
  };

  // Експортуємо методи для використання в плагіні
  defineExpose({
    addMessage,
    removeMessage,
  });
</script>

<template>
  <teleport to="body">
    <div class="vt-message-container">
      <transition-group name="vt-message" tag="div">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'vt-message-item',
            `vt-message-item--${message.type}`,
            { 'vt-message-item--closable': message.showClose },
          ]"
        >
          <div class="vt-message-icon">
            <VIcon :color="message.type === 'primary' ? '#00475A' : ''" :name="getIcon(message.type)" />
          </div>
          <div class="vt-message-content">
            <div v-if="message.title" class="vt-message-title">{{ message.title }}</div>

            <div v-if="message.dangerouslyUseHTMLString" class="vt-message-text" v-html="message.message" />
            <div v-else class="vt-message-text">{{ message.message }}</div>
          </div>
          <button v-if="message.showClose" class="vt-message-close" type="button" @click="removeMessage(message.id)">
            <VIcon name="close" />
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>
