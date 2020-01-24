/** WIP
 * @description An object containing `height`/`width` settings for the plugin GUI window.
 *
 * @kind constant
 * @name CUSTOM_TRANSLATIONS
 * @type {Object}
 */
const CUSTOM_TRANSLATIONS: Array<Array<{
  text: string,
  id: string,
}>> = [
  [
    // Connect
    {
      text: 'Connect',
      id: 'en', // English
    },
    {
      text: 'تواصل',
      id: 'ar', // Arabic
    },
    {
      text: '建立联系',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '建立關係',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Navázat spojení',
      id: 'cs', // Czech
    },
    {
      text: 'Opret forbindelse',
      id: 'da', // Danish
    },
    {
      text: 'Connectie maken',
      id: 'nl', // Dutch
    },
    {
      text: 'Se connecter',
      id: 'fr', // French
    },
    {
      text: 'Vernetzen',
      id: 'de', // German
    },
    {
      text: 'Terhubung',
      id: 'id', // Indonesian
    },
    {
      text: 'Collegati',
      id: 'it', // Italian
    },
    {
      text: 'つながりを申請',
      id: 'ja', // Japanese
    },
    {
      text: '1촌 맺기',
      id: 'ko', // Korean
    },
    {
      text: 'Berhubung',
      id: 'ms', // Malay
    },
    {
      text: 'Knytt kontakt',
      id: 'no', // Norwegian
    },
    {
      text: 'Nawiąż kontakt',
      id: 'pl', // Polish
    },
    {
      text: 'Conectar',
      id: 'pt', // Portuguese
    },
    {
      text: 'Conectați-vă',
      id: 'ro', // Romanian
    },
    {
      text: 'Установить контакт',
      id: 'ru', // Russian
    },
    {
      text: 'Conectar',
      id: 'es', // Spanish
    },
    {
      text: 'Skapa kontakt',
      id: 'sv', // Swedish
    },
    {
      text: 'Komonekta',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'ทำความรู้จัก',
      id: 'th', // Thai
    },
    {
      text: 'Bağlantı Kur',
      id: 'tr', // Turkish
    }
  ],
  [
    // Invite
    {
      text: 'Invite',
      id: 'en', // English
    },
    {
      text: 'دعوة',
      id: 'ar', // Arabic
    },
    {
      text: '邀请',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '邀請',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Pozvat',
      id: 'cs', // Czech
    },
    {
      text: 'inviter',
      id: 'da', // Danish
    },
    {
      text: 'uitnodigen',
      id: 'nl', // Dutch
    },
    {
      text: 'inviter',
      id: 'fr', // French
    },
    {
      text: 'Einladen',
      id: 'de', // German
    },
    {
      text: 'undang',
      id: 'id', // Indonesian
    },
    {
      text: 'invita',
      id: 'it', // Italian
    },
    {
      text: 'つながりを申請',
      id: 'ja', // Japanese
    },
    {
      text: '초대하기',
      id: 'ko', // Korean
    },
    {
      text: 'jemput',
      id: 'ms', // Malay
    },
    {
      text: 'inviter',
      id: 'no', // Norwegian
    },
    {
      text: 'Zaproś',
      id: 'pl', // Polish
    },
    {
      text: 'Convite',
      id: 'pt', // Portuguese
    },
    {
      text: 'Invitați',
      id: 'ro', // Romanian
    },
    {
      text: 'Пригласить',
      id: 'ru', // Russian
    },
    {
      text: 'Invitar',
      id: 'es', // Spanish
    },
    {
      text: 'Skicka kontaktförfrågan',
      id: 'sv', // Swedish
    },
    {
      text: 'Imbitahan',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'เชิญ',
      id: 'th', // Thai
    },
    {
      text: 'Davet Et',
      id: 'tr', // Turkish
    }
  ],
  [
    // Invited
    {
      text: 'Invited',
      id: 'en', // English
    },
    {
      text: 'تمت الدعوة',
      id: 'ar', // Arabic
    },
    {
      text: '已邀请',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '已邀請',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Již pozván(a)',
      id: 'cs', // Czech
    },
    {
      text: 'Inviteret',
      id: 'da', // Danish
    },
    {
      text: 'Uitgenodigd',
      id: 'nl', // Dutch
    },
    {
      text: 'Invitation envoyée',
      id: 'fr', // French
    },
    {
      text: 'Eingeladen',
      id: 'de', // German
    },
    {
      text: 'Diundang',
      id: 'id', // Indonesian
    },
    {
      text: 'Invito inviato',
      id: 'it', // Italian
    },
    {
      text: '招待済み',
      id: 'ja', // Japanese
    },
    {
      text: '초대 메일 보냄',
      id: 'ko', // Korean
    },
    {
      text: 'Dijemput',
      id: 'ms', // Malay
    },
    {
      text: 'Invitert',
      id: 'no', // Norwegian
    },
    {
      text: 'Zaproszony(-a)',
      id: 'pl', // Polish
    },
    {
      text: 'Convidados',
      id: 'pt', // Portuguese
    },
    {
      text: 'Invitați',
      id: 'ro', // Romanian
    },
    {
      text: 'Приглашение отправлено',
      id: 'ru', // Russian
    },
    {
      text: 'Invitado',
      id: 'es', // Spanish
    },
    {
      text: 'Inbjudan skickad',
      id: 'sv', // Swedish
    },
    {
      text: 'Inimbitahan',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'เชิญแล้ว',
      id: 'th', // Thai
    },
    {
      text: 'Davet Edildi',
      id: 'tr', // Turkish
    }
  ],
  [
    // Like
    {
      text: 'Like',
      id: 'en', // English
    },
    {
      text: 'إعجاب',
      id: 'ar', // Arabic
    },
    {
      text: '赞',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '讚',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'To se mi líbí',
      id: 'cs', // Czech
    },
    {
      text: 'Synes godt om',
      id: 'da', // Danish
    },
    {
      text: 'Interessant',
      id: 'nl', // Dutch
    },
    {
      text: 'J’aime',
      id: 'fr', // French
    },
    {
      text: 'Gefällt mir',
      id: 'de', // German
    },
    {
      text: 'Suka',
      id: 'id', // Indonesian
    },
    {
      text: 'Consiglia',
      id: 'it', // Italian
    },
    {
      text: 'いいね！',
      id: 'ja', // Japanese
    },
    {
      text: '추천',
      id: 'ko', // Korean
    },
    {
      text: 'Suka',
      id: 'ms', // Malay
    },
    {
      text: 'Lik',
      id: 'no', // Norwegian
    },
    {
      text: 'Poleć',
      id: 'pl', // Polish
    },
    {
      text: 'Gostei',
      id: 'pt', // Portuguese
    },
    {
      text: 'Apreciați',
      id: 'ro', // Romanian
    },
    {
      text: 'Нравится',
      id: 'ru', // Russian
    },
    {
      text: 'Recomendar',
      id: 'es', // Spanish
    },
    {
      text: 'Gilla',
      id: 'sv', // Swedish
    },
    {
      text: 'Gusto ko ito',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'ชอบ',
      id: 'th', // Thai
    },
    {
      text: 'Beğen',
      id: 'tr', // Turkish
    }
  ],
  [
    // Comment
    {
      text: 'Comment',
      id: 'en', // English
    },
    {
      text: 'تعليق',
      id: 'ar', // Arabic
    },
    {
      text: '评论',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '回應',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Komentář',
      id: 'cs', // Czech
    },
    {
      text: 'Kommenter',
      id: 'da', // Danish
    },
    {
      text: 'Commentaar',
      id: 'nl', // Dutch
    },
    {
      text: 'Commenter',
      id: 'fr', // French
    },
    {
      text: 'Kommentieren',
      id: 'de', // German
    },
    {
      text: 'Komentar',
      id: 'id', // Indonesian
    },
    {
      text: 'Commenta',
      id: 'it', // Italian
    },
    {
      text: 'コメント',
      id: 'ja', // Japanese
    },
    {
      text: '댓글',
      id: 'ko', // Korean
    },
    {
      text: 'Komen',
      id: 'ms', // Malay
    },
    {
      text: 'Kommenter',
      id: 'no', // Norwegian
    },
    {
      text: 'Skomentuj',
      id: 'pl', // Polish
    },
    {
      text: 'Comentar',
      id: 'pt', // Portuguese
    },
    {
      text: 'Comentați',
      id: 'ro', // Romanian
    },
    {
      text: 'Комментировать',
      id: 'ru', // Russian
    },
    {
      text: 'Comentar',
      id: 'es', // Spanish
    },
    {
      text: 'Kommentera',
      id: 'sv', // Swedish
    },
    {
      text: 'Magkomento',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'ความคิดเห็น',
      id: 'th', // Thai
    },
    {
      text: 'Yorum Yap',
      id: 'tr', // Turkish
    }
  ],
  [
    // Share
    {
      text: 'Share',
      id: 'en', // English
    },
    {
      text: 'مشاركة',
      id: 'ar', // Arabic
    },
    {
      text: '分享',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '分享',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Sdílet',
      id: 'cs', // Czech
    },
    {
      text: 'Del',
      id: 'da', // Danish
    },
    {
      text: 'Delen',
      id: 'nl', // Dutch
    },
    {
      text: 'Partager',
      id: 'fr', // French
    },
    {
      text: 'Mitteilen',
      id: 'de', // German
    },
    {
      text: 'Bagikan',
      id: 'id', // Indonesian
    },
    {
      text: 'Condividi',
      id: 'it', // Italian
    },
    {
      text: 'シェア',
      id: 'ja', // Japanese
    },
    {
      text: '공유',
      id: 'ko', // Korean
    },
    {
      text: 'Kongsi',
      id: 'ms', // Malay
    },
    {
      text: 'Del',
      id: 'no', // Norwegian
    },
    {
      text: 'Udostępnij',
      id: 'pl', // Polish
    },
    {
      text: 'Compartilhar',
      id: 'pt', // Portuguese
    },
    {
      text: 'Distribuiţi',
      id: 'ro', // Romanian
    },
    {
      text: 'Поделиться',
      id: 'ru', // Russian
    },
    {
      text: 'Compartir',
      id: 'es', // Spanish
    },
    {
      text: 'Dela',
      id: 'sv', // Swedish
    },
    {
      text: 'Ibahagi',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'แบ่งปัน',
      id: 'th', // Thai
    },
    {
      text: 'Paylaş',
      id: 'tr', // Turkish
    }
  ],
  [
    // Photo
    {
      text: 'Photo',
      id: 'en', // English
    },
    {
      text: 'صوره',
      id: 'ar', // Arabic
    },
    {
      text: '照片',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '相片',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Fotografie',
      id: 'cs', // Czech
    },
    {
      text: 'Foto',
      id: 'da', // Danish
    },
    {
      text: 'Foto',
      id: 'nl', // Dutch
    },
    {
      text: 'Photo',
      id: 'fr', // French
    },
    {
      text: 'Foto',
      id: 'de', // German
    },
    {
      text: 'Foto',
      id: 'id', // Indonesian
    },
    {
      text: 'Foto',
      id: 'it', // Italian
    },
    {
      text: '写真',
      id: 'ja', // Japanese
    },
    {
      text: '사진',
      id: 'ko', // Korean
    },
    {
      text: 'Foto',
      id: 'ms', // Malay
    },
    {
      text: 'Bilde',
      id: 'no', // Norwegian
    },
    {
      text: 'Zdjęcie',
      id: 'pl', // Polish
    },
    {
      text: 'Foto',
      id: 'pt', // Portuguese
    },
    {
      text: 'Fotografie',
      id: 'ro', // Romanian
    },
    {
      text: 'Фото',
      id: 'ru', // Russian
    },
    {
      text: 'Foto',
      id: 'es', // Spanish
    },
    {
      text: 'Profilbild',
      id: 'sv', // Swedish
    },
    {
      text: 'Larawan',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'รูปภาพ',
      id: 'th', // Thai
    },
    {
      text: 'Fotoğraf',
      id: 'tr', // Turkish
    }
  ],
  [
    // Follow
    {
      text: 'Follow',
      id: 'en', // English
    },
    {
      text: 'متابعه',
      id: 'ar', // Arabic
    },
    {
      text: '关注',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '關注',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Sledovat',
      id: 'cs', // Czech
    },
    {
      text: 'Følg',
      id: 'da', // Danish
    },
    {
      text: 'Volgen',
      id: 'nl', // Dutch
    },
    {
      text: 'Suivre',
      id: 'fr', // French
    },
    {
      text: 'Folgen',
      id: 'de', // German
    },
    {
      text: 'Ikuti',
      id: 'id', // Indonesian
    },
    {
      text: 'Segui',
      id: 'it', // Italian
    },
    {
      text: 'フォロー',
      id: 'ja', // Japanese
    },
    {
      text: '팔로우',
      id: 'ko', // Korean
    },
    {
      text: 'Ikuti',
      id: 'ms', // Malay
    },
    {
      text: 'Følg',
      id: 'no', // Norwegian
    },
    {
      text: 'Obserwuj',
      id: 'pl', // Polish
    },
    {
      text: 'Seguir',
      id: 'pt', // Portuguese
    },
    {
      text: 'Urmăriți',
      id: 'ro', // Romanian
    },
    {
      text: 'Отслеживать',
      id: 'ru', // Russian
    },
    {
      text: 'Seguir',
      id: 'es', // Spanish
    },
    {
      text: 'Följ',
      id: 'sv', // Swedish
    },
    {
      text: 'ติดตาม',
      id: 'th', // Thai
    },
    {
      text: 'Takip Et',
      id: 'tr', // Turkish
    }
  ],
  [
    // Following
    {
      text: 'Following',
      id: 'en', // English
    },
    {
      text: 'تمت المتابعةة',
      id: 'ar', // Arabic
    },
    {
      text: '已关注',
      id: 'zh-Hans', // S.Chinese
    },
    {
      text: '關注中',
      id: 'zh-Hant', // T.Chinese
    },
    {
      text: 'Sledované',
      id: 'cs', // Czech
    },
    {
      text: 'Følger',
      id: 'da', // Danish
    },
    {
      text: 'Aan het volgen',
      id: 'nl', // Dutch
    },
    {
      text: 'Suivi',
      id: 'fr', // French
    },
    {
      text: 'Folgen',
      id: 'de', // German
    },
    {
      text: 'Mengikuti',
      id: 'id', // Indonesian
    },
    {
      text: 'Già segui',
      id: 'it', // Italian
    },
    {
      text: 'フォロー中',
      id: 'ja', // Japanese
    },
    {
      text: '팔로우 중',
      id: 'ko', // Korean
    },
    {
      text: 'Mengikuti',
      id: 'ms', // Malay
    },
    {
      text: 'Følger``',
      id: 'no', // Norwegian
    },
    {
      text: 'Obserwujesz',
      id: 'pl', // Polish
    },
    {
      text: 'Seguindo',
      id: 'pt', // Portuguese
    },
    {
      text: 'Urmărire',
      id: 'ro', // Romanian
    },
    {
      text: 'Отслеживаете',
      id: 'ru', // Russian
    },
    {
      text: 'Siguiendo',
      id: 'es', // Spanish
    },
    {
      text: 'Följer',
      id: 'sv', // Swedish
    },
    {
      text: 'Sinusubaybayan',
      id: 'fil', // Filipino / Tagalog
    },
    {
      text: 'กำลังติดตาม',
      id: 'th', // Thai
    },
    {
      text: 'Takip Ediliyor',
      id: 'tr', // Turkish
    }
  ],
];

export default CUSTOM_TRANSLATIONS;
