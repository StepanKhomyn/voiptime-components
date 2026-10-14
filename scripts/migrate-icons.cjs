#!/usr/bin/env node
// Міграція старих назв іконок (src/icons: arrowDown, filterSave, ...) на нові згруповані
// (src/icon-groups: arrows_down, filter_save, ...) у проєктах, які використовують voiptime-components.
//
// Використання (з кореня проєкту):
//   node <шлях-до-vue-component-lib>/scripts/migrate-icons.cjs [dir ...] [--dry]
//
//   dir    - папки/файли для обробки (за замовчуванням ./src)
//            для Flask/Jinja-проєкту без src: node .../migrate-icons.cjs . --dry
//   --dry  - нічого не записувати, лише показати, що буде змінено
//
// Що замінюється автоматично:
//   - name="..." / :name="..." на тегах, назва яких містить "icon" (VIcon, v-icon, ...)
//   - icon="..." / prefix-icon="..." / suffix-icon="..." / :icon="..." на будь-яких тегах
//   - у JS/TS: значення ключів і змінних, назва яких містить "icon" (icon: 'edit', iconName = 'close', ...)
// Наприкінці виводиться список місць, де стара назва залишилась як рядок і її треба перевірити вручну.

const fs = require('fs');
const path = require('path');

// стара назва -> нова; null - нового відповідника немає (ellipse - замість іконки використовуйте звичайний div/span з border-radius)
const ICON_MAP = {
  addLine: 'misc_add_line',
  addNewRecord: 'player_add_new_record',
  analyseRecord: 'player_transcription_start',
  channelsChange: 'filter_exchange',
  circleChecked: 'input_circle_checked',
  circleClose: 'input_circle_close',
  close: 'input_close',
  copy: 'actions_copy',
  delete: 'actions_delete',
  download: 'files_download',
  edit: 'actions_edit',
  forward: 'message_forward',
  goTo: 'actions_go_to',
  listBulletHorizontal: 'table_list_bullet_horizontal',
  listBullet: 'table_list_bullet',
  lock: 'actions_lock',
  logOut: 'actions_logout',
  paperClip: 'message_paper_clip',
  plusRound: 'input_plus_round',
  prompter: 'ai_prompter',
  prompt: 'ai_prompt',
  reply: 'message_reply',
  save: 'actions_save',
  settingsFilled: 'actions_settings_filled',
  star: 'actions_star',
  statusChange: 'status_change',
  unlock: 'actions_unlock',
  uploadCloud: 'files_upload_cloud',
  usersGroup: 'users_group',
  aI: 'ai_ai',
  aIPrompter: 'ai_prompter',
  aIPrompt: 'ai_prompt',
  arrowDoubleLeft: 'arrows_double_left',
  arrowDoubleRight: 'arrows_double_right',
  arrowDown: 'arrows_down',
  arrowLeft: 'arrows_left',
  arrowNewLine: 'arrows_new_line',
  arrowReload: 'arrows_reload',
  arrowRight: 'arrows_right',
  arrowTop: 'arrows_top',
  addNumber: 'ivr_add_number',
  answerCall: 'phone_answer_call',
  clientCall: 'users_user',
  hangupCall: 'phone_hangup_call',
  inboundCall: 'phone_inbound_call',
  keyboardCall: 'ivr_keyboard_call',
  microphoneCall: 'misc_microphone_call',
  outboundCall: 'ivr_outbound_call',
  ownCall: 'phone_own_call',
  phoneActiveTalk: 'phone_active_talk',
  phoneArrowDown: 'notification_phone_arrow_down',
  phoneCalling: 'phone_calling',
  phoneCancelRecall: 'phone_cancel_recall',
  phoneExecuteRecall: 'input_ok',
  phoneHangup: 'phone_hangup',
  phoneInactiveTalk: 'phone_inactive_talk',
  phoneOffline: 'phone_offline',
  phoneOutgoingCall: 'phone_outgoing_call',
  phoneRecall: 'phone_recall',
  phoneTalking: 'phone_talking',
  phoneTransfer: 'phone_transfer',
  phoneUnavailable: 'phone_unavailable',
  scenarioCall: 'left_menu_scenario_call',
  speaker: 'player_speaker',
  speakerMuted: 'player_speaker_muted',
  telemarketCall: 'phone_outgoing_call',
  transferCall: 'phone_transfer_call',
  volumeCall: 'ivr_volume_call',
  scale: 'call_quality_scale',
  scaleOff: 'call_quality_scale_off',
  chatAttention: 'chat_attention',
  chatBlock: 'chat_block',
  chatCheck: 'chat_check',
  chatDabble: 'right_menu_chat_double',
  chatDelete: 'chat_delete',
  chatFlash: 'chat_flash',
  chatForward: 'chat_forward',
  chatIdentification: 'chat_identification',
  chatIn: 'chat_in',
  chatOut: 'chat_out',
  chatRemove: 'chat_remove',
  chatStar: 'chat_star',
  chatTag: 'chat_tag',
  chatVIP: 'chat_vip',
  facebookEChat: 'media_facebook_echat',
  facebook: 'media_facebook',
  instagram: 'media_instagram',
  telegramEChat: 'media_telegram_echat',
  telegram: 'media_telegram',
  viberEChat: 'media_viber_echat',
  viber: 'media_viber',
  whatsUp: 'media_whatsapp',
  widget: 'media_widget',
  clientActivity: 'client_activity',
  clientComment: 'client_comment',
  clientContacts: 'client_contacts',
  clientDigitalChannel: 'client_digital_channel',
  clientHistory: 'client_history',
  clientLocation: 'client_location',
  clientSocial: 'client_social_media',
  clientTask: 'left_menu_client_task',
  clientVoiceChannel: 'phone_phone',
  conversationAccept: 'chat_check',
  conversationAudio: 'conversation_audio',
  conversationBot: 'conversation_bot',
  conversationDismiss: 'chat_delete',
  conversationEmojis: 'message_emojis',
  conversationHash: 'chat_tag',
  conversationJoinMember: 'conversation_join_member',
  conversationPin: 'conversation_pin',
  conversationQuickAnswer: 'chat_flash',
  conversationRedirect: 'conversation_redirect',
  conversationSendMessage: 'message_send_message',
  conversationTopPanel: 'misc_conversation_top_panel',
  conversationUnPin: 'conversation_unpin',
  conversationVideo: 'conversation_video',
  messageDocument: 'message_document',
  messageEdit: 'message_edit',
  messageReply: 'message_reply',
  messageStatusDelivered: 'message_status_delivered',
  azerbaijan: 'flags_azerbaijan',
  kazakhstan: 'flags_kazakhstan',
  poland: 'flags_poland',
  terrorist: 'flags_russia',
  thailand: 'flags_thailand',
  ukraine: 'flags_ukraine',
  unitedKingdom: 'flags_united_kingdom',
  alignCenter: 'text_editor_align_center',
  alignJustify: 'text_editor_align_justify',
  alignLeft: 'text_editor_align_left',
  alignRight: 'text_editor_align_right',
  blockquote: 'text_editor_blockquote',
  clearFormat: 'text_editor_clear_format',
  fontName: 'text_editor_font_name',
  html: 'misc_html',
  image: 'message_image',
  indent: 'text_editor_indent',
  link: 'actions_link',
  orderedList: 'text_editor_ordered_list',
  outdent: 'text_editor_outdent',
  redo: 'arrows_redo',
  subscript: 'text_editor_subscript',
  superscript: 'text_editor_superscript',
  tagType: 'text_editor_tag_type',
  textBold: 'text_editor_bold',
  textItalic: 'text_editor_italic',
  textStrikethrough: 'text_editor_strikethrough',
  textUnderline: 'text_editor_underline',
  undo: 'arrows_undo',
  unorderedList: 'text_editor_unordered_list',
  ellipse: null,
  fieldBoolean: 'field_boolean',
  fieldEnum: 'field_enum',
  fieldFK: 'field_fk',
  fieldInteger: 'field_integer',
  fieldString: 'field_string',
  emptyImg: 'message_image',
  fileChoose: 'misc_file_choose',
  fileDoc: 'message_document',
  fileSign: 'misc_file_sign',
  folder: 'files_folder',
  filterAdd: 'filter_add',
  filterAdvanced: 'filter_advanced',
  filterDateCheck: 'filter_date_check',
  filterEdit: 'filter_edit',
  filterExchange: 'filter_exchange',
  filterMultiselect: 'filter_multiselect',
  filterNew: 'filter_new',
  filterReset: 'filter_reset',
  filterSave: 'filter_save',
  alertCircle: 'input_alert_triangle',
  alertTriangle: 'input_alert_circle',
  calendar: 'calendar_calendar',
  checkCircle: 'input_check_circle',
  clock: 'ivr_clock',
  eyeClosed: 'input_eye_closed',
  eyeOpened: 'input_eye_opened',
  infoCircle: 'input_info_circle',
  search: 'input_search',
  url: 'input_url',
  emailDeleted: 'mail_deleted',
  emailDraft: 'mail_draft',
  email: 'mail_email',
  emailIncoming: 'mail_incoming',
  emailNew: 'mail_new',
  emailOutgoing: 'mail_outgoing',
  emailQueue: 'mail_queue',
  emailSpam: 'mail_spam',
  acdCondition: 'acd_condition',
  acdConditionInTime: 'acd_condition_in_time',
  acdConditionOperatorAvailable: 'acd_condition_operator_available',
  acdConditionOperatorInAvailable: 'acd_condition_in_time',
  acdConditionOutOfTime: 'acd_condition_out_of_time',
  acdPresentOperatorCondition: 'acd_present_operator_condition',
  acdQueueTimeoutCondition: 'acd_queue_timeout_condition',
  addCelebrationDay: 'calendar_add_celebration_day',
  addDay: 'calendar_add_day',
  add: 'actions_add',
  addToQueue: 'misc_add_to_queue',
  analizeIvrNumber: 'ivr_analyze_number',
  blackList: 'ivr_black_list',
  box: 'misc_box',
  callAcd: 'acd_call_acd',
  callQualityBlock: 'call_quality_block',
  callQualityTemplate: 'call_quality_template',
  callToOperator: 'ivr_outbound_call',
  checkConnection: 'misc_check_connection',
  condition: 'ivr_condition',
  continueInDialPlan: 'misc_continue_in_dial_plan',
  dbRead: 'ivr_db_read',
  dbWrite: 'ivr_db_write',
  diamond: 'call_quality_diamond',
  diamondInSquare: 'right_menu_diamond_in_square',
  dsr: 'misc_dsr',
  emptyRound: 'phone_cancel_recall',
  hold: 'player_hold',
  httpGet: 'ivr_http_get',
  hungUpPhone: 'ivr_hung_up_phone',
  identificator: 'misc_identificator',
  import: 'files_import',
  ivr: 'left_menu_ivr',
  ivrRecall: 'ivr_recall',
  menu: 'ivr_menu',
  minus: 'actions_minus',
  moveToIvr: 'ivr_move_to_ivr',
  nodeTree: 'table_node_tree',
  notification: 'notification_notification',
  notificationRead: 'notification_read',
  operator: 'itr_operator',
  operatorSkill: 'itr_operator_skill',
  playFile: 'ivr_play_file',
  plus: 'actions_add',
  predictive: 'status_predictive',
  preview: 'status_preview',
  prioritySelect: 'status_priority_select',
  progressive: 'status_progressive',
  qrCode: 'misc_qr_code',
  quiz: 'itr_quiz',
  readDTMF: 'ivr_read_dtmf',
  recordEnd: 'ivr_record_end',
  recordStart: 'ivr_record_start',
  schedule: 'calendar_schedule',
  sendEmail: 'mail_send_email',
  sendText: 'message_send_text',
  setVariableValue: 'ivr_set_variable_value',
  sms: 'client_sms',
  starFilled: 'actions_star_filled',
  statisticDetail: 'statistics_detail',
  statisticMonitoring: 'statistics_monitoring',
  statisticSummary: 'statistics_summary',
  statusSelect: 'status_select',
  taskSelect: 'tasks_select',
  transcription: 'player_transcription',
  transcriptionStart: 'player_transcription_start',
  user: 'users_user',
  voiceMail: 'ivr_voice_mail',
  wait: 'ivr_wait',
  week: 'ivr_week',
  windowStart: 'misc_window_start',
  circleDownload: 'input_circle_download',
  pause: 'player_hold',
  start: 'player_start',
  stop: 'player_stop',
  anketBlock: 'scenario_anket_block',
  callSubject: 'scenario_call_subject',
  iframBlock: 'scenario_iframe_block',
  infoBlock: 'scenario_info_block',
  proposalBlock: 'scenario_proposal_block',
  variable: 'ivr_variable',
  comment: 'tasks_comment',
  timeManagementCircle: 'calendar_time_management_circle',
  timer: 'calendar_timer',
  callQuality: 'left_menu_call_quality',
  callQualityStatistic: 'left_menu_call_quality_statistics',
  clients: 'left_menu_clients',
  collection: 'left_menu_collection',
  crm: 'left_menu_crm',
  dashboard: 'left_menu_dashboard',
  group: 'left_menu_group',
  home: 'misc_home',
  integration: 'left_menu_integration',
  iTR: 'left_menu_i_tr',
  pbx: 'left_menu_pbx',
  scenarios: 'left_menu_scenarios',
  settings: 'left_menu_settings',
  tasks: 'left_menu_client_task',
  users: 'users_users',
  wFM: 'left_menu_w_fm',
  statsDiagramPie: 'right_menu_stats_diagram_pie',
  columnInsert: 'table_column_insert',
  columnsMove: 'table_columns_move',
  empty: 'files_empty',
  excel: 'message_excel',
  freeze: 'table_freeze',
  listAdd: 'table_list_add',
  noChat: 'no_data_chat',
  noData: 'no_data_default',
  noSound: 'no_data_sound',
  numberList: 'table_number_list',
  tableSettings: 'table_settings',
  twoColumns: 'table_two_columns',
  twoRows: 'table_two_rows',
  unfreeze: 'table_unfreeze',
};

const EXTENSIONS = ['.vue', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.html', '.jinja', '.jinja2', '.j2', '.py'];
const IGNORE_DIRS = new Set([
  'node_modules', 'dist', 'build', '.git', '.nuxt', '.output', 'coverage', 'public',
  // Python
  'venv', '.venv', 'env', '__pycache__', 'site-packages', 'migrations', '.pytest_cache', '.mypy_cache', '.tox',
]);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry');
const targets = args.filter(arg => !arg.startsWith('--'));
if (!targets.length) targets.push('src');

const LITERAL_RE = /(['"`])([A-Za-z][A-Za-z0-9]*)\1/g;

const stats = { files: 0, replacements: 0, byName: {} };
const noEquivalent = [];
const manualReview = [];

function collectFiles(target) {
  if (!fs.existsSync(target)) {
    console.warn(`⚠️  Не знайдено: ${target}`);
    return [];
  }
  if (fs.statSync(target).isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) return IGNORE_DIRS.has(entry.name) ? [] : collectFiles(full);
    return EXTENSIONS.includes(path.extname(entry.name)) ? [full] : [];
  });
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

// Замінює рядкові літерали зі старими назвами всередині фрагмента коду
function replaceLiterals(code, ctx) {
  return code.replace(LITERAL_RE, (match, quote, name, offset) => {
    if (!(name in ICON_MAP)) return match;
    const next = ICON_MAP[name];
    if (!next) {
      noEquivalent.push({ ...ctx, name, line: ctx.line + lineOf(code, offset) - 1 });
      return match;
    }
    stats.replacements++;
    stats.byName[name] = (stats.byName[name] || 0) + 1;
    return `${quote}${next}${quote}`;
  });
}

const isIconTag = tag => /icon/i.test(tag);
const isIconAttr = attr => /^(?:[:@]|v-bind:)?(?:[\w-]*-)?icon(?:-?name)?$/i.test(attr) || /^(?::|v-bind:)?\w*Icon$/.test(attr);
const isNameAttr = attr => /^(?::|v-bind:)?name$/.test(attr);

// Проходить по всіх HTML-тегах і замінює значення атрибутів з іконками
function processTags(text, file) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    const lt = text.indexOf('<', i);
    if (lt === -1) {
      out += text.slice(i);
      break;
    }
    out += text.slice(i, lt);
    const tagMatch = /^<([A-Za-z][\w.-]*)/.exec(text.slice(lt, lt + 100));
    if (!tagMatch) {
      out += '<';
      i = lt + 1;
      continue;
    }
    const tag = tagMatch[1];
    let j = lt + tagMatch[0].length;
    out += tagMatch[0];
    // атрибути
    while (j < text.length) {
      const ws = /^\s*/.exec(text.slice(j, j + 200))[0];
      out += ws;
      j += ws.length;
      if (text[j] === '>' || text.startsWith('/>', j) || j >= text.length) break;
      const nameMatch = /^[^\s=>/'"]+/.exec(text.slice(j, j + 200));
      if (!nameMatch) {
        out += text[j];
        j++;
        continue;
      }
      const attr = nameMatch[0];
      out += attr;
      j += attr.length;
      const eq = /^\s*=\s*/.exec(text.slice(j, j + 50));
      if (!eq) continue;
      out += eq[0];
      j += eq[0].length;
      const quote = text[j];
      if (quote !== '"' && quote !== "'") continue;
      const end = text.indexOf(quote, j + 1);
      if (end === -1) break;
      const value = text.slice(j + 1, end);
      const bound = /^(?::|v-bind:)/.test(attr);
      const relevant = isIconAttr(attr) || (isNameAttr(attr) && isIconTag(tag));
      let newValue = value;
      if (relevant) {
        const ctx = { file, line: lineOf(text, j) };
        if (bound) {
          newValue = replaceLiterals(value, ctx);
        } else if (value in ICON_MAP) {
          newValue = replaceLiterals(`"${value}"`, ctx).slice(1, -1);
        }
      } else if (/^(?::|@|#|v-)/.test(attr)) {
        // вираз у шаблоні: :items="[{ icon: 'edit' }]"
        newValue = processScript(value, file);
      }
      out += quote + newValue + quote;
      j = end + 1;
    }
    // вміст <script> обробляється як JS, <style> не чіпаємо
    const lowerTag = tag.toLowerCase();
    if ((lowerTag === 'script' || lowerTag === 'style') && text[j] === '>') {
      const close = text.indexOf(`</${lowerTag}`, j);
      const contentEnd = close === -1 ? text.length : close;
      const content = text.slice(j + 1, contentEnd);
      out += '>' + (lowerTag === 'script' ? processScript(content, file) : content);
      j = contentEnd;
    }
    i = j;
  }
  return out;
}

// Кінець виразу: до коми / крапки з комою / переносу рядка / закриваючої дужки на нульовому рівні
function expressionEnd(text, start) {
  let depth = 0;
  let quote = null;
  for (let k = start; k < text.length; k++) {
    const ch = text[k];
    if (quote) {
      if (ch === '\\') k++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) {
      if (depth === 0) return k;
      depth--;
    } else if (depth === 0 && (ch === ',' || ch === ';' || ch === '\n')) return k;
  }
  return text.length;
}

// icon: 'x', iconName = 'x', prefixIcon: cond ? 'a' : 'b', icon === 'x' ...
function processScript(text, file) {
  const KEY_RE = /(['"]?)\b([\w$]*[Ii]con[\w$]*)\1\s*(?:===|!==|==|!=|=(?!>)|:)\s*/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = KEY_RE.exec(text))) {
    const start = m.index + m[0].length;
    const end = expressionEnd(text, start);
    const expr = text.slice(start, end);
    if (!LITERAL_RE.test(expr)) {
      LITERAL_RE.lastIndex = 0;
      continue;
    }
    LITERAL_RE.lastIndex = 0;
    out += text.slice(last, start) + replaceLiterals(expr, { file, line: lineOf(text, start) });
    last = end;
    KEY_RE.lastIndex = end;
  }
  return processTypedBlocks(out + text.slice(last), file);
}

// Індекс після парної закриваючої дужки для '{' на позиції open
function blockEnd(text, open) {
  let depth = 0;
  let quote = null;
  for (let k = open; k < text.length; k++) {
    const ch = text[k];
    if (quote) {
      if (ch === '\\') k++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') quote = ch;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return k + 1;
  }
  return -1;
}

// Блоки, типізовані як IconName:
//   function iconForType(type): IconName { ... return 'fieldString' }
//   const PHONE_ICONS: Record<string, IconName> = { ... }
function processTypedBlocks(text, file) {
  const TYPED_RE = /\bIconName\b[^{};=()]*(?:=\s*)?\{/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = TYPED_RE.exec(text))) {
    const open = m.index + m[0].length - 1;
    const close = blockEnd(text, open);
    if (close === -1) continue;
    out += text.slice(last, open) + replaceLiterals(text.slice(open, close), { file, line: lineOf(text, open) });
    last = close;
    TYPED_RE.lastIndex = close;
  }
  return out + text.slice(last);
}

// Контексти, в яких рядок майже напевно не є іконкою (шум у звіті)
const NOT_ICON_BEFORE = [
  /[\w:@.#-]=["']?$/, // значення HTML-атрибута: type="email", @click="close", :type="'operator'"
  /\b(?:path|route|prop|type|for|id|key|fieldName|component|role|command|block|group|value)\s*:\s*$/,
  /[\w$\]]\([^()]*$/, // аргумент функції: openDialog('edit', row), emit('filterReset')
  /\[\s*(?:(['"`])[^'"`]*\1\s*,\s*)*$/, // масив рядків: ['url', 'password']
  /(?:===|!==|==|!=)\s*$/, // порівняння: type === 'edit'
  /\bcase\s+$/,
  /\$\{[^}]*$/, // всередині ${...} у шаблонному рядку
  /(?:===|!==|==|!=)[^?]*\?(?:[^:]*:)?\s*$/, // тернарний оператор за результатом порівняння
  /\|\s*$/, // TS union: 'a' | 'b'
  /\b(?:dropEffect|effectAllowed)\s*=\s*$/, // drag & drop: dropEffect = 'copy'
  /\[\s*$/, // доступ за ключем: f["operator"]
  /\{\s*(?:(['"])[^'"]*\1\s*,\s*)*$/, // множина рядків (Python): {"email", "uuid"}
  /\b(?:name|__tablename__|tablename)\s*=\s*$/, // Python: name = "users", __tablename__ = "user"
];
const NOT_ICON_AFTER = [/^\s*\|/, /^\s*(?:===|!==|==|!=)/];

function findLeftovers(text, file) {
  text.split('\n').forEach((line, idx) => {
    // рядок, що складається лише з рядкового літерала: елемент списку колонок/полів
    if (/^\s*(['"`])\w+\1,?\s*$/.test(line)) return;
    // коментарі та гілки багаторядкового тернарного оператора (? 'copy' / : 'move')
    if (/^\s*(?:\/\/|\/?\*|\?|:|#)/.test(line)) return;
    for (const m of line.matchAll(LITERAL_RE)) {
      if (!ICON_MAP[m[2]]) continue;
      const before = line.slice(0, m.index);
      const after = line.slice(m.index + m[0].length);
      if (NOT_ICON_BEFORE.some(re => re.test(before)) || NOT_ICON_AFTER.some(re => re.test(after))) continue;
      // ключ словника/об'єкта: "operator": ... (але не гілка тернарного: cond ? 'a' : 'b')
      if (/^\s*:(?!:)/.test(after) && !/\?\s*$/.test(before)) continue;
      // ключ, що містить саме значення: users: 'users', EMAIL = 'email', facebook_accounts: 'facebook'
      const key = /([\w$]+)['"]?\s*[:=]\s*$/.exec(before);
      if (key && key[1].toLowerCase().includes(m[2].toLowerCase())) continue;
      manualReview.push({ file, line: idx + 1, name: m[2], code: line.trim() });
    }
  });
}

const files = targets.flatMap(collectFiles);
for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let text = original;
  // .vue/.html: теги + <script>; .ts/.js: лише JS; .tsx/.jsx: і те, і те
  const isTemplate = /\.(vue|html|jinja2?|j2)$/.test(file);
  if (isTemplate || /\.[jt]sx$/.test(file)) text = processTags(text, file);
  // Jinja: {% set icon = 'x' %}, {{ macro(icon='x') }}
  if (isTemplate) text = text.replace(/\{[{%][\s\S]*?[}%]\}/g, block => processScript(block, file));
  // .ts/.js/.py: icon: 'x', "icon": "x", icon='x'
  if (!isTemplate) text = processScript(text, file);
  findLeftovers(text, file);
  if (text !== original) {
    stats.files++;
    if (!dryRun) fs.writeFileSync(file, text);
    console.log(`${dryRun ? '[dry] ' : ''}✏️  ${file}`);
  }
}

console.log(`\n✅ ${dryRun ? 'Буде змінено' : 'Змінено'} файлів: ${stats.files}, замін: ${stats.replacements}`);

const seen = new Set();
const uniqueNoEquivalent = noEquivalent.filter(e => {
  const key = `${e.file}:${e.line}:${e.name}`;
  return seen.has(key) ? false : seen.add(key);
});

if (uniqueNoEquivalent.length) {
  console.log('\n⚠️  Іконки без нового відповідника (лишились старі назви, вони deprecated, але працюють):');
  uniqueNoEquivalent.forEach(e => console.log(`   ${e.file}:${e.line}  ${e.name}`));
}

if (manualReview.length) {
  console.log('\n🔍 Перевірте вручну - стара назва залишилась як рядок (можливо це не іконка):');
  manualReview.forEach(e => console.log(`   ${e.file}:${e.line}  ${e.name} -> ${ICON_MAP[e.name]}    ${e.code.slice(0, 120)}`));
}
