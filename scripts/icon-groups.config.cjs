// Конфігурація імпорту іконок з Figma у src/icon-groups.
// Використовується скриптом scripts/fetch-figma-icons.cjs

module.exports = {
  // https://www.figma.com/design/<fileKey>/...
  fileKey: '6VQ3TVEZ2eEew06yQdjPFK',

  // Секція у Figma, в якій лежать усі фрейми з іконками
  rootSection: '_ICONs_',

  outputDir: './src/icon-groups',

  // Іконки, які містять ці кольори, пропускаються.
  // Сірий у легенді дизайнера означає "є тільки у Фігмі, чи потрібні не знаю"
  skipColors: ['#828282'],

  // Фрейми, які не є іконками
  ignoreFrames: ['LEGEND'],

  /**
   * Групи іконок.
   * folder  - папка в src/icon-groups (kebab-case), з неї ж формується префікс назви (left-menu -> left_menu_)
   * frames  - шляхи фреймів у Figma (через "/"), іконки з яких потрапляють у групу
   * strip   - слова, які прибираються з початку назви, щоб не дублювати префікс (messageEdit -> message_edit)
   * multicolor - зберігати оригінальні кольори (не замінювати на currentColor)
   */
  groups: [
    { folder: 'left-menu', frames: ['MENU/MENU_left'], strip: ['menu'] },
    { folder: 'right-menu', frames: ['MENU/MENU_right'], strip: ['menu'] },
    { folder: 'message', frames: ['Message'], strip: ['message', 'chat'] },
    { folder: 'chat', frames: ['CHAT', 'chatVIP'], strip: ['chat'] },
    { folder: 'conversation', frames: ['Conversation'], strip: ['conversation'] },
    { folder: 'media', frames: ['MEDIA'], multicolor: true },
    { folder: 'mail', frames: ['MAIL'], strip: ['email', 'mail'] },
    { folder: 'phone', frames: ['PHONE', 'Call'], strip: ['phone'], multicolorIcons: ['answerCall', 'hangupCall'] },
    { folder: 'ivr', frames: ['IVR'], strip: ['ivr'] },
    { folder: 'acd', frames: ['ACD'], strip: ['acd'] },
    { folder: 'player', frames: ['PLEYER', 'transcription'], strip: ['pleyer', 'player'] },
    { folder: 'client', frames: ['Client'], strip: ['client', 'contacts'] },
    { folder: 'users', frames: ['USERs'], strip: ['users', 'user'] },
    { folder: 'status', frames: ['STATUS'], strip: ['status'] },
    { folder: 'notification', frames: ['notification'], strip: ['notification'] },
    { folder: 'tasks', frames: ['TASKs'], strip: ['tasks', 'task'] },
    { folder: 'calendar', frames: ['Calendar', 'timeManagement'], strip: ['calendar'] },
    { folder: 'text-editor', frames: ['Text', 'Script'], strip: ['text'] },
    { folder: 'table', frames: ['table', 'LIST_sotring'], strip: ['table'] },
    { folder: 'filter', frames: ['FILTER'], strip: ['filter'] },
    { folder: 'field', frames: ['field'], strip: ['field'] },
    { folder: 'input', frames: ['inputs'] },
    { folder: 'files', frames: ['load', 'folder'] },
    { folder: 'arrows', frames: ['arrow'], strip: ['arrow'] },
    { folder: 'actions', frames: ['CRUD', 'adjust', 'access', 'Star', 'navigation'] },
    { folder: 'statistics', frames: ['Statistic'], strip: ['statistic'] },
    { folder: 'widget', frames: ['widget'], strip: ['widget'] },
    { folder: 'call-quality', frames: ['CALLquality'], strip: ['call', 'quality'] },
    { folder: 'itr', frames: ['ITR'], strip: ['itr'] },
    { folder: 'ai', frames: ['AI'] },
    { folder: 'flags', frames: ['Lang'], multicolor: true },
    { folder: 'no-data', frames: ['no-data'], strip: ['no'], multicolor: true },
    { folder: 'misc', frames: ['UnSorted'] },
  ],

  // Ручні перейменування: "<folder>/<назва у Figma>": "<назва без префікса групи>"
  // Виправлення одруківок дизайну та неочевидних назв
  rename: {
    'client/CONTACTs_social_media': 'social_media',
    'message/conversationSendMessage': 'send_message',
    'message/conversationEmojis': 'emojis',
    'conversation/conversationUnPin': 'unpin',
    'users/userDel': 'delete',
    'users/userDelited': 'deleted',
    'player/forword': 'forward',
    'ivr/analizeIvrNumber': 'analyze_number',
    'phone/hungUpPhone': 'hung_up',
    'left-menu/grup': 'group',
    'left-menu/callQualityStatistis': 'call_quality_statistics',
    'right-menu/chatDabble': 'chat_double',
    'media/whatsUp': 'whatsapp',
    'media/viberEChat': 'viber_echat',
    'media/telegramEChat': 'telegram_echat',
    'media/facebookEChat': 'facebook_echat',
    'no-data/noData': 'default',
  },
};
