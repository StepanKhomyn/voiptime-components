<script lang="ts" setup>
  export type TableRow = {
    name: string;
    type?: string;
    default?: string;
    description: string;
    required?: boolean;
  };

  export type TableSection = {
    title: 'Props' | 'Events' | 'Slots' | string;
    rows: TableRow[];
  };

  defineProps<{
    sections: TableSection[];
  }>();
</script>

<template>
  <div class="doc-props">
    <div v-for="section in sections" :key="section.title" class="doc-props__section">
      <h3 class="doc-props__heading">{{ section.title }}</h3>
      <div class="doc-props__table-wrap">
        <table class="doc-props__table">
          <thead>
            <tr>
              <th>Назва</th>
              <th v-if="section.rows.some(r => r.type)">Тип</th>
              <th v-if="section.rows.some(r => r.default !== undefined)">За замовч.</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in section.rows" :key="row.name">
              <td>
                <code class="doc-props__name">{{ row.name }}</code>
                <span v-if="row.required" class="doc-props__req" title="Обов'язковий">*</span>
              </td>
              <td v-if="section.rows.some(r => r.type)">
                <code v-if="row.type" class="doc-props__type">{{ row.type }}</code>
                <span v-else class="doc-props__dash">—</span>
              </td>
              <td v-if="section.rows.some(r => r.default !== undefined)">
                <code v-if="row.default !== undefined" class="doc-props__default">{{ row.default }}</code>
                <span v-else class="doc-props__dash">—</span>
              </td>
              <td class="doc-props__desc">{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .doc-props {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    &__heading {
      font-size: 1rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 0.75rem;
      padding-left: 0.5rem;
      border-left: 3px solid #3498db;
    }

    &__table-wrap {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e5e9f0;
    }

    &__table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;

      thead tr {
        background: #f5f7fa;
      }

      th {
        padding: 0.6rem 1rem;
        font-weight: 600;
        color: #555;
        text-align: left;
        white-space: nowrap;
        border-bottom: 1px solid #e5e9f0;
      }

      td {
        padding: 0.6rem 1rem;
        border-bottom: 1px solid #f0f2f6;
        vertical-align: top;

        &:last-child {
          border-bottom: none;
        }
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      tbody tr:hover td {
        background: #f9fbff;
      }
    }

    &__name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: #3498db;
      background: #eaf4fd;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
    }

    &__type {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #8e44ad;
      background: #f5eefe;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      white-space: pre-wrap;
    }

    &__default {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #27ae60;
      background: #edfbf3;
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
    }

    &__req {
      color: #e74c3c;
      font-weight: 700;
      margin-left: 2px;
      font-size: 0.9rem;
    }

    &__dash {
      color: #bbb;
    }

    &__desc {
      color: #444;
      line-height: 1.45;
    }
  }
</style>
