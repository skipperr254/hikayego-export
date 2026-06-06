export const normalAvatars = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=BasicUser1&backgroundColor=e3f2fd',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=BasicUser2&backgroundColor=f3e5f5',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=BasicUser3&backgroundColor=e8f5e8',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=BasicUser4&backgroundColor=fff3e0',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=BasicUser5&backgroundColor=fce4ec'
];

export const premiumMaleAvatars = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=DragonKnight&backgroundColor=1a1a2e&clothingColor=16213e&hairColor=ffd700&skinColor=f4c2a1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=CyberWarrior&backgroundColor=0f3460&clothingColor=16537e&hairColor=00d4ff&skinColor=e8b4a0',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=ShadowMaster&backgroundColor=2d1b69&clothingColor=8e44ad&hairColor=34495e&skinColor=d4af37',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=FireLord&backgroundColor=8b0000&clothingColor=ff4500&hairColor=ff6347&skinColor=deb887',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=IceKing&backgroundColor=4682b4&clothingColor=87ceeb&hairColor=e0ffff&skinColor=f0f8ff'
];

export const premiumFemaleAvatars = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=MysticQueen&backgroundColor=4b0082&clothingColor=9370db&hairColor=dda0dd&skinColor=ffb6c1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=StarGoddess&backgroundColor=191970&clothingColor=483d8b&hairColor=ffd700&skinColor=ffe4e1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=NatureSpirit&backgroundColor=228b22&clothingColor=32cd32&hairColor=90ee90&skinColor=f5deb3',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=PhoenixPrincess&backgroundColor=dc143c&clothingColor=ff69b4&hairColor=ff1493&skinColor=ffc0cb',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=CrystalMage&backgroundColor=20b2aa&clothingColor=48d1cc&hairColor=afeeee&skinColor=f0ffff'
];

export const allPremiumAvatars = [...premiumMaleAvatars, ...premiumFemaleAvatars];
export const allAvatars = normalAvatars;
export const allAvatarsWithPremium = [...normalAvatars, ...allPremiumAvatars];