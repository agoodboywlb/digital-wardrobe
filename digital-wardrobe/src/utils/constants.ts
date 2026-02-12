import { Category, ItemStatus } from '@/types/index';

import type { ClothingItem, ImportRecord, Outfit } from '@/types/index';

// Placeholder images
const IMAGES = {
  hoodie: "https://lh3.googleusercontent.com/aida-public/AB6AXuCytrgWmJeGvvKZtyOwtXnYPBIkz1DrJlsfu2Gb1cEOmJgxb79bpb_ijNZkbQ1a8XICTzHnTSfsWmRQV0AQ7pMiON-sA5vur4UyoOVpWUINtrkQDG_pMF6S1A1W4HtyR_88CWU8eqj7P3el6bWnZxKQtKsm2JGHsUNbbfu3trj87M__TVZPbXHEGS7gRbSk-NKGPYpYO6Fnu4pVF30VEQpaQ517Z-ONQTKu3YXsSL8Ad-nMRAAG0Uvm9givf_W6z3kRwv3CVst10Ik7",
  pants: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnsIyS4o3hUGSedHCcrjpEOhS39cS8Z2soHKNYtMahb5vaqroIe_FP3OXdQppF2MbC-ethKmY2BzDjkF8TweXHxi4Vj4X03NIRKr4GVlHXlSErdrRx54_cnA7xZauaQF_kQSngEI_Du8I81R4QxpsRKHxRaMKULqEGG658uad3fF0pKuE6Ro6yJV4Kjlf23YvapAiT6r5PWC8pV09P8G_iKpMOD5IiY0VmnnZztClojaYV5x9Iqrk1LDrjyWsp85-5M3IuwHFPlKqG",
  jacket: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL_5q00frqKFqHy3RSQAevMPLFICNPvr4mc2IOwNidHNlFgKvEs98irq6KADba_LUBxHvELlEsc_p9RanqAkz5bW_lBXi88QjTcg9sS_uUI3p2DxOlKnEq_-ifDM57O_c9jYJW2Q_2mtNBP-e9Z931JAVLlJsOvPr0Y-DhHucYIZMR3kqZgTZAPD3y42jmaLTMRqOhqv_xljQIJd-RPVhz-OheDOQsQ-WVWEm5zDWGhdFSfmDqkElOdAWd71pFsrCBdoWAP6rDNhgV",
  shoes: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2GUozsKTf2JyiYAgrBMwqaUWUlJhaug0vbxx6nQhusY5iXyLMEwwd4xH7VshmE7u1aKJQx7cw3ET8AhYGPD_caaGP1phF7Unea4UYyy0iwQyZT6IfKgdiU_6ElsTaJ975Joa0_U0K9J96cMZ94NgxzaQZIP8z6cfBula-JFtNpsZFR0dzZn_uI5-2fEBIp3iYPZvgPNUeQ6FLMdmAaRkF4K-jvJWK3jcHSUUugT0cdrfkS7juS47rmzLOqPR2psm0qXkoUTQvEmr0",
  leatherJacket: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAJSY6xpDLAruYsW4Yi8R9_mSezOGHTO-Md4hdXJvuKkZLhlSUYMRyXY635euESgLartkau42BzV6_bx-cmZcepYFPVhHHUCDoptAN7ut8ZjPO8YsE-CfCGle1oE2mHna0_6ooYd4WNmuhr7N1vY7a0qpHN1L7uavssyS6EoB8-Ht76rCFuxPssKihXQSvFabl-BEob2ri8FGTpSIY2pYB3a3QzFwJDHyIp-lNFDurziJJCgYJmyGqZLFa5SODWdeGC9M0ZNQmD5by",
  fleece: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoLtmjt3zHDMjzr7L5eb4D0ll00wljXS-I-sCDeXrmZ5xX1lCcdzK1DsMl9VBJpiJEk0sg5hl75xAq2NsVeEjs3cCW5LXq_q7ib1wIqOcoRkr7bYwAsZtvN9uN-z_yyjmRLj5cysLt9Yv5MgiRF20DaKykTZq0EB0PS6Fqj9SOF6fBNZQoewkSiro2zcSn6Jw1HjTWRLTT00ZkaoROn6jDCjx0qdUp9KiU9l78j5DNDXaNTLi61P-f8xy0cUaLg_INe0yBl6oxQYYe"
};

export const MOCK_ITEMS: ClothingItem[] = [
  {
    id: '1',
    name: '基础款连帽卫衣',
    category: Category.Tops,
    subCategory: '卫衣',
    imageUrl: IMAGES.hoodie,
    status: ItemStatus.InWardrobe,
    tags: ['纯棉', '休闲', '春季'],
    purchaseDate: '2023-09-15',
    lastWorn: '2023-11-01',
    price: 399,
    wearCount: 12,
    brand: 'Nike',
    size: 'L (180/100A)',
    material: '纯棉'
  },
  {
    id: '2',
    name: '卡其休闲裤',
    category: Category.Bottoms,
    subCategory: '长裤',
    imageUrl: IMAGES.pants,
    status: ItemStatus.ToWash,
    tags: ['舒适', '通勤', '纯棉'],
    price: 299,
    brand: 'Uniqlo',
    size: '32',
    material: '棉混纺'
  },
  {
    id: '3',
    name: '羽绒面包服',
    category: Category.Outerwear,
    subCategory: '夹克',
    imageUrl: IMAGES.jacket,
    status: ItemStatus.InWardrobe,
    tags: ['保暖', '冬季', '防风'],
    price: 899,
    brand: 'The North Face',
    size: 'M',
    material: '锦纶/鹅绒'
  },
  {
    id: '4',
    name: '轻量跑步鞋',
    category: Category.Footwear,
    subCategory: '运动鞋',
    imageUrl: IMAGES.shoes,
    status: ItemStatus.InWardrobe,
    tags: ['跑步', '透气', '轻便'],
    price: 1299,
    brand: 'Adidas',
    size: '42.5',
    material: '网面'
  },
  {
    id: '5',
    name: '复古皮夹克',
    category: Category.Outerwear,
    subCategory: '夹克',
    imageUrl: IMAGES.leatherJacket,
    status: ItemStatus.AtTailor,
    tags: ['复古', '秋季', '机车'],
    price: 2500,
    brand: 'Schott NYC',
    size: '40',
    material: '牛皮'
  },
  {
    id: '6',
    name: '摇粒绒套头衫',
    category: Category.Outerwear,
    subCategory: '摇粒绒',
    imageUrl: IMAGES.fleece,
    status: ItemStatus.InWardrobe,
    tags: ['户外', '秋季', '保暖'],
    price: 699,
    brand: 'Patagonia',
    material: '再生聚酯纤维',
    purchaseDate: '2023-10-12',
    lastWorn: '2天前',
    size: 'M (175/96A)'
  }
];

export const MOCK_OUTFITS: Outfit[] = [
  {
    id: 'o1',
    title: '商务休闲风',
    date: '今天',
    time: '9:00 AM',
    occasion: '工作 • 秋季系列',
    status: 'planned',
    items: [MOCK_ITEMS[0] as ClothingItem, MOCK_ITEMS[1] as ClothingItem]
  },
  {
    id: 'o2',
    title: '晨跑装备',
    date: '明天',
    time: '6:30 AM',
    occasion: '运动 • 轻量化',
    status: 'planned',
    items: [MOCK_ITEMS[0] as ClothingItem, MOCK_ITEMS[3] as ClothingItem]
  },
  {
    id: 'o3',
    title: '周五约会',
    date: '周五',
    time: '8:00 PM',
    occasion: '晚间 • 精致休闲',
    status: 'planned',
    items: [MOCK_ITEMS[4] as ClothingItem, MOCK_ITEMS[1] as ClothingItem, MOCK_ITEMS[3] as ClothingItem]
  },
  {
    id: 'o4',
    title: '周末徒步',
    date: '周六',
    time: '10:00 AM',
    occasion: '户外 • 防水',
    status: 'planned',
    items: [MOCK_ITEMS[2] as ClothingItem, MOCK_ITEMS[1] as ClothingItem]
  }
];

export const MOCK_IMPORTS: ImportRecord[] = [
  {
    id: 'i1',
    title: '优衣库 U系列 圆领T恤 455359',
    source: '淘宝',
    date: '2023-10-24 14:30',
    price: 99.00,
    status: 'parsed',
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDz_b-JTW0TmunkiW5HBHLL7sddtBKEz1wqP6x60CyVFnsMrl8ZvWcH3-UQ-dr4JXuWNwxUdFSra3FfcJbGY13H0amaGU3bPVgJW2wzR2GU0k4lakRTqDMJz6i4Wn2Im8LJIIzfKJ8o8dueisFQffuyNQc1X2nUIQixQhNr9W7z1S5TpDMQtflsER3DvUbaxTeBUtpqTi4chMrqp5-hKglyEur0nOGeTBoEOtXBsR_11T4BcQx9Hq4SSWo5f59720c1yKzQEtaZ2TdM"
  },
  {
    id: 'i2',
    title: 'Zara 阔腿牛仔裤 复古水洗蓝 8246/22',
    source: '淘宝',
    date: '2023-10-24 14:28',
    price: 259.00,
    status: 'parsing',
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN1BgHvIDkOfiOv5Aiio6CncQjwEz4Js_7u-O3jdGaMopD7ITG0gGFP7RzqZuymoIy4Y7H8DGfScoZ538OXE-3dMr4OLYM7cDhLZptXXaLcTWo0sDIPcEHXQubqkgB8EEg6v0u1EN3U8GMiyNpZwRGYmZgatUH_5jQ2hfu4VIAUoM-VuM_ALfX4QJetiSnD2vw8BPVrTZfeJ-1BZ5T05WccRitCnVgGYTgdX9ZJJrVUhlpLyZ6HEzRjUHo-JfeFLojPLWcKqIl2TWR"
  },
  {
    id: 'i3',
    title: '未知商品 - 订单号 #1928374655',
    source: '淘宝',
    date: '2023-10-24 12:15',
    price: 0.00,
    status: 'review_needed',
    imageUrl: ""
  },
  {
    id: 'i4',
    title: 'COS 羊毛混纺大衣 黑色 M码',
    source: '淘宝',
    date: '2023-10-23 18:45',
    price: 1299.00,
    status: 'parsed',
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVqsR89nOuJ6s82lmp95_zoolKQwnXAaobZlF85jGPVOpNf1NbYF13kAcPvHqTJD5JyQFfWNIELxg2CPkaQBGLheNlRSB7LhyxHNLVX_41xlvzrOiX6deedOQSjVVye0I_V-_n04qgbVT-UkxFXlafijgxL0HDH3T30NVzixfoZP-0DFCAWSiaCc5s41ZNhBc4Vp86RlaZIWWsi61IdB7U9hgWuA20Ngugg60bMTXmFj4o3kfEBb391cAtzdUol9qDDkERSnDenntK"
  },
  {
    id: 'i5',
    title: '无印良品 法兰绒衬衫',
    source: '淘宝',
    date: '2023-10-22 09:20',
    price: 198.00,
    status: 'imported',
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoQWoGdFCJTUxbzU9bNAbHaCN1v5i5uNcRJEhG1CxWSLH-iTFIgkdZLXeiW5Iz8DircO8efoeTyfGv4AK-x2ZDsPTC0KK4UiMExt0_iDzp62GZve0UKSbe9ZQw7wQJE1um63wvBuRvdszl6HcMigLt2uaQqzQjibLx4RtfXuhULF3qKIAnBW_pHYXRgMUldMiBUKL4B3dNQLpczEcYd1SEorgx6hjfib8M8P_XgXSH4zUt4qEISn-OfQRCRg5f53yXK_i8vt_ub6Qn"
  }
];