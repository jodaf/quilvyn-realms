/*
Copyright 2021, James J. Hayes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program; if not, write to the Free Software Foundation, Inc., 59 Temple
Place, Suite 330, Boston, MA 02111-1307 USA.
*/

/*jshint esversion: 6 */
"use strict";

/*
 * This module loads the prestige class rules for the Forgotten Realms v3
 * campaign setting rule book. Member methods can be called independently in
 * order to use a subset of the rules. Similarly, the RealmsPrestige.CLASSES
 * constant field can be manipulated in order to modify the choices.
 */
function RealmsPrestige() {
  if(window.Realms == null) {
    alert('The RealmsPrestige module requires use of the Realms module');
    return;
  }
  RealmsPrestige.identityRules(Realms.rules, RealmsPrestige.CLASSES);
  RealmsPrestige.magicRules(Realms.rules, RealmsPrestige.SPELLS);
  RealmsPrestige.talentRules(Realms.rules, RealmsPrestige.FEATURES);
}

RealmsPrestige.CLASSES = {
  'Arcane Devotee':
    'Require=' +
      '"features.Enlarge Spell","skills.Knowledge (Religion) >= 8",' +
      '"skills.Spellcraft >= 8","spellSlots.B4||spellSlots.S4||spellSlots.W4" '+
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Alchemy, Scry => 3.5 Craft (Alchemy), null
      'Concentration,Craft,Knowledge,Profession,Spellcraft ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Freely Enlarge Spell","2:Alignment Focus",' +
      '"2:Sacred Defense","5:Divine Shroud"',
  'Archmage':
    'Require=' +
      '"features.Skill Focus (Spellcraft)",' +
      '"Sum \'^features\\.Spell Focus\' >= 2",' +
      '"skills.Knowledge (Arcana) >= 15","skills.Spellcraft >= 15",' +
      '"spellSlots.S7||spellSlots.W7 >= 1","level5SpellSchools >= 5" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
       // 3.0 Alchemy, Scry => 3.5 Craft (Alchemy), null
      'Concentration,"Craft (Alchemy)",Knowledge,Profession,Search,' +
      'Spellcraft ' +
    'Features="1:Caster Level Bonus" ' +
    'Selectables=' +
      '"1:Arcane Fire","1:Arcane Reach",' +
      '"features.Arcane Reach ? 1:Improved Arcane Reach",' +
      '"1:Mastery Of Counterspelling","1:Mastery Of Elements",' +
      '"1:Mastery Of Shaping","1:Spell Power +1","1:Spell Power +2",' +
      '"Spell Power +3","1:Spell-Like Ability"',
  'Divine Champion':
    'Require=' +
       '"baseAttack >= 7","Sum \'features.Weapon Focus\' >= 1",' +
       '"skills.Knowledge (Religion) >= 3" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      'Climb,Craft,"Handle Animal",Jump,"Knowledge (Religion)",Ride,Spot,Swim '+
    'Features=' +
      '"1:Armor Proficiency (Medium)",' +
      '"1:Shield Proficiency (Heavy)",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Heal The Flock","2:Sacred Defense","3:Smite Infidel",' +
      '"5:Divine Wrath"',
  'Divine Disciple':
    'Require=' +
      '"skills.Diplomacy >= 5","skills.Knowledge (Religion) >= 8",' +
      '"spellSlots.C4||spellSlots.D4" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Scry, Wilderness Lore => 3.5 null, Survival
      'Concentration,Craft,Diplomacy,Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Nature)","Knowledge (Religion)",Profession,Spellcraft,' +
      'Survival ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Divine Emissary","1:New Domain",' +
      '"2:Sacred Defense","3:Imbue With Spell Ability","5:Native Outsider",' +
      '"5:Transcendence"',
  'Divine Seeker':
    'Require=' +
      '"skills.Hide >= 10","skills.Knowledge (Religion) >= 3",' +
      '"skills.Move Silently >= 8","skills.Spot >= 5" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      // 3.0 Intuit Direction, Pick Pocket => 3.5 Survival, Sleight Of Hand
      'Bluff,Climb,Craft,"Decipher Script",Diplomacy,"Disable Device",Jump,' +
      '"Knowledge (Religion)",Listen,"Move Silently","Open Lock",' +
      'Profession,Search,"Sleight Of Hand",Spot,Survival,Tumble,"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Thwart Glyph","2:Sacred Defense","2:Sneak Attack",' +
      '"5:Divine Perseverance" ' +
      'SpellAbility=charisma ' +
      'SpellSlots=' +
        'Seeker1:1=1,' +
        'Seeker3:3=2,' +
        'Seeker4:5=1',
  'Guild Thief':
    'Require=' +
      '"skills.Gather Information >= 3","skills.Hide >= 8",' +
      '"skills.Intimidate >= 3","skills.Move Silently >= 3" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=6 Fortitude=1/3 Reflex=1/2 Will=1/3 ' +
    'Skills=' +
      // 3.0 Innuendo, Pick Pocket => 3.5 Bluff, Sleight Of Hand
      'Appraise,Bluff,Climb,Craft,Diplomacy,"Disable Device",Forgery,' +
      'Intimidate,Jump,"Knowledge (Local)",Listen,"Move Silently",' +
      '"Open Lock",Profession,Search,"Sense Motive","Sleight Of Hand",Spot,' +
      '"Use Rope" ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Sneak Attack",1:Doublespeak,"2:Uncanny Dodge",3:Reputation,' +
      '"5:Improved Uncanny Dodge"',
  'Harper Scout':
    'Require=' +
      '"alignment !~ \'Evil\'","features.Alertness","features.Iron Will",' +
      '"skills.Bluff >= 4","skills.Diplomacy >= 8",' +
      '"skills.Knowledge (Local) >= 4","Sum \'skills.Perform\' >= 5",' +
      '"skills.Sense Motive >= 2","skills.Survival >= 2" ' +
    'HitDie=d6 Attack=3/4 SkillPoints=4 Fortitude=1/3 Reflex=1/2 Will=1/2 ' +
    'Skills=' +
      // 3.0 Intuit Direction, Pick Pocket => 3.5 Survival, Sleight Of Hand
      'Appraise,Bluff,Climb,Craft,Diplomacy,Disguise,"Escape Artist",' +
      '"Gather Information",Hide,Jump,Knowledge,Listen,"Move Silently",' +
      'Perform,Profession,"Sense Motive","Speak Language",Survival,Swim,' +
      'Tumble ' +
    'Features=' +
      '"1:Armor Proficiency (Light)",' +
      '"1:Weapon Proficiency (Simple)",' +
      '"1:Bardic Knowledge","1:Favored Enemy","2:Deneir\'s Eye",' +
      '"2:Harper Perform Focus","2:Harper Skill Focus","3:Tymora\'s Smile",' +
      '"4:Lliira\'s Heart","5:Craft Harper Item" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Harper1:1=0;2=1,' +
      'Harper2:3=0;4=1,' +
      'Harper3:5=0',
  'Hathran':
    'Require=' +
      '"alignment =~ \'Lawful Good|Lawful Neutral|Neutral Good\'",' +
      '"deity =~ \'Chauntea|Mielikki|Mystra\'","features.Ethran",' +
      '"race =~ \'Human\'","region =~ \'Rashemen|Rashemi\'",' +
      '"spellSlots.B2||spellSlots.S2||spellSlots.W2",' +
      '"spellSlots.C2||spellSlots.D2||spellSlots.P2||spellSlots.R2" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Alchemy, Animal Empathy, Intuit Direction, Scry, Wilderness Lore =>
      // 3.5 Craft (Alchemy), null, Survival, null, Survival
      'Concentration,Craft,Knowledge,Perform,Profession,"Speak Language",' +
      'Spellcraft,Survival,Swim ' +
    'Features=' +
      '"1:Weapon Proficiency (Whip)",' +
      '"1:Caster Level Bonus","1:Cohort","1:Place Magic","4:Circle Leader" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Hathran1:3=1,' +
      'Hathran4:10=1',
  'Hierophant':
    'Require=' +
      '"skills.Knowledge (Nature) >= 15||skills.Knowledge (Religion) >= 15",' +
      '"spellSlots.C7||spellSlots.D7",' +
      '"sumMetamagicFeats > 0" ' +
    'HitDie=d8 Attack=1/2 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Scry => 3.5 null
      'Concentration,Craft,Diplomacy,Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Religion)",Profession,Spellcraft ' +
    'Selectables=' +
      '"1:Blast Infidel","1:Divine Reach","1:Faith Healing",' +
      '"1:Gift Of The Divine","1:Improved Divine Reach",' +
      '"1:Mastery Of Energy","1:Spell Power +2","1:Spell-Like Ability",' +
      '"levels.Druid > 0 ? 1:Power Of Nature"',
  'Purple Dragon Knight':
    'Require=' +
      '"alignment !~ \'Chaotic|Evil\'","baseAttack >= 4",' +
      '"features.Leadership","features.Mounted Combat",' +
      '"skills.Diplomacy >= 1||skills.Intimidate >= 1",' +
      '"skills.Listen >= 2","skills.Ride >= 2","skills.Spot >= 2" ' +
    'HitDie=d10 Attack=1 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/3 ' +
    'Skills=' +
      'Climb,Diplomacy,Intimidate,Jump,Ride,Swim ' +
    'Features=' +
      '"Armor Proficiency (Medium)",' +
      '"Shield Proficiency (Heavy)",' +
      '"Weapon Proficiency (Simple)",' +
      '"1:Heroic Shield","1:Rallying Cry","2:Knight\'s Courage",' +
      '"4:Oath Of Wrath","5:Final Stand" ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Purple3:3=1',
  'Red Wizard':
    'Require=' +
      '"alignment !~ \'Good\'","race == \'Human\'","region == \'Thay\'",' +
      '"skills.Spellcraft >= 8","spellSlots.B3||spellSlots.S3||spellSlots.W3",'+
      '"features.Tattoo Focus","sumItemCreationAndMetamagicFeats >= 3" ' +
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Alchemy, Innuendo, Scry => 3.5 Craft (Alchemy), Bluff, null
      'Bluff,Concentration,Craft,Intimidate,Knowledge,Profession,Spellcraft ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Enhanced Specialization",' +
      '"1:Specialist Defense","2:Spell Power","5:Circle Leader",' +
      '"7:Scribe Tattoo","10:Great Circle Leader"',
  'Runecaster':
    'Require=' +
      '"features.Inscribe Rune","Sum \'skills.Craft\' >= 8",' +
      '"skills.Spellcraft >= 8",' +
      '"spellSlots.C3||spellSlots.D3||spellSlots.P3||spellSlots.R3" ' +
    'HitDie=d8 Attack=3/4 SkillPoints=2 Fortitude=1/2 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Scry => 3.5 null
      'Concentration,Craft,Diplomacy,Heal,"Knowledge (Arcana)",' +
      '"Knowledge (Religion)",Profession,Spellcraft ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Rune Craft","2:Rune Power",' +
      '"3:Improved Runecasting","6:Maximize Rune","10:Rune Chant"',
  'Shadow Adept':
    'Require=' +
      '"alignment !~ \'Good\'",' +
      '"spellSlots.B3||spellSlots.C3||spellSlots.D3||spellSlots.R3||spellSlots.S3||spellSlots.W3",' +
      '"skills.Knowledge (Arcana) >= 8","skills.Spellcraft >= 8",' +
      '"features.Shadow Weave Magic","sumMetamagicFeats >= 1" ' +
    'HitDie=d8 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Scry => 3.5 null
      'Bluff,Concentration,Craft,Disguise,Hide,Knowledge,Profession,' +
      'Spellcraft ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Insidious Magic","1:Pernicious Magic",' +
      '"1:Tenacious Magic","2:Low-Light Vision","2:Shadow Defense",' +
      '"3:Spell Power","4:Shield Of Shadows","7:Darkvision",' +
      '"8:Greater Shield Of Shadows","10:Shadow Double" ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Shadow4:7=1'
};
RealmsPrestige.FEATURES = {
  'Alignment Focus':
    'Section=magic ' +
    'Note="+1 caster level on spells from chosen alignment component"',
  'Arcane Fire':'Section=magic Note="Transform arcane spell into bolt of fire"',
  'Arcane Reach':'Section=magic Note="Use arcane touch spell 30\' away"',
  'Blast Infidel':
    'Section=magic ' +
    'Note="Negative energy spells vs. foe w/different deity have max effect"',
  'Caster Level Bonus':
    'Section=magic Note="+%V base class level for spells known and spells/dy"',
  'Circle Leader':
    'Section=magic ' +
    'Note="1 hr ritual w/2-5 other members raises caster level, gives metamagic feats"',
  'Cohort':'Section=feature Note="Gain Hathran or Barbarian follower"',
  'Craft Harper Item':
    'Section=magic Note="Create magic instruments, Harper pins, and potions"',
  "Deneir's Eye":'Section=save Note="+2 vs. glyphs, runes, and symbols"',
  'Divine Emissary':
    'Section=feature Note="Telepathy w/same-alignment outsider w/in 60\'"',
  'Divine Perseverance':
    'Section=combat Note="Regain 1d8+5 HP from negative 1/dy"',
  'Divine Reach':'Section=magic Note="Use divine touch spell 30\' away"',
  'Divine Shroud':
    'Section=save Note="Aura provides DC %V spell resistance for %1 rd 1/dy"',
  'Divine Wrath':
    'Section=combat,save ' +
    'Note="+3 attack and damage and DR 5/- for %V rd 1/dy",' +
         '"+3 saves %V rd 1/dy",',
  // 3.0 Innuendo => 3.5 Bluff
  'Doublespeak':'Section=skill Note="+2 Bluff/+2 Diplomacy"',
  'Enhanced Specialization':'Section=magic Note="Additional opposition school"',
  'Faith Healing':
    'Section=magic Note="Healing spells on followers of %1 have max effect"',
  'Final Stand':
    'Section=combat Note="R10\' %V allies gain 2d10 HP for %1 rd 1/dy"',
  'Freely Enlarge Spell':'Section=magic Note="Cast enlarged spell %V/dy"',
  'Gift Of The Divine':
    'Section=feature Note="Transfer undead turn/rebuke to another 1-10 days"',
  'Great Circle Leader':
    'Section=magic Note="Lead magic circle w/9 other members"',
  'Greater Shield Of Shadows':
    'Section=save Note="Shield Of Shadows gives %V spell resistance"',
  'Harper Perform Focus':
    'Section=feature ' +
    'Note="+1 General Feat (Skill Focus in chosen Perform)"',
  'Harper Skill Focus':
    'Section=feature ' +
    'Note="+1 General Feat (Skill Focus in Harper class skill)"',
  'Heal The Flock':'Section=magic Note="Heal followers of %1 %V HP/dy"',
  'Heroic Shield':'Section=combat Note="Aid Another action gives +4 AC bonus"',
  'Imbue With Spell Ability':
    'Section=magic ' +
    'Note="<i>Imbue With Spell Ability</i> 1st/2nd level spells at will"',
  'Improved Arcane Reach':
    'Section=magic Note="Use arcane touch spell 60\' away"',
  'Improved Divine Reach':
    'Section=magic Note="Use divine touch spell 60\' away"',
  'Improved Runecasting':
    'Section=magic Note="Add charges and triggers to runes"',
  "Knight's Courage":
    'Section=magic ' +
    'Note="Allies +1 attack and damage, +2 charm and fear saves during speech +5 rd %V/dy"',
  "Lliira's Heart":'Section=save Note="+2 vs. compulsion and fear"',
  'Mastery Of Counterspelling':
    'Section=magic Note="Counterspell turns effect back on caster"',
  'Mastery Of Elements':'Section=magic Note="Change energy type of spell"',
  'Mastery Of Energy':
    'Section=combat Note="+4 undead turning checks and damage"',
  'Mastery Of Shaping':'Section=magic Note="Create holes in spell effect area"',
  'Maximize Rune':'Section=magic Note="+5 DC/maximize effects of runes"',
  'New Domain':'Section=feature Note="Choose additional deity domain"',
  'Oath Of Wrath':
    'Section=combat,save,skill ' +
    'Note="R60\' +2 attack and damage vs. chosen opponent until encounter ends 1/dy",' +
         '"R60\' +2 save vs. chosen opponent until encounter ends 1/dy",' +
         '"R60\' +2 checks vs. chosen opponent until encounter ends 1/dy"',
  'Place Magic':
    'Section=magic Note="Cast spell w/out preparation when in Rashemen"',
  'Power Of Nature':
    'Section=feature Note="Transfer druid feature to another 1-10 days"',
  'Rallying Cry':
    'Section=combat Note="R60\' Allies +1 next attack, +5 speed for 1 tn 3/dy"',
  'Reputation':'Section=feature Note="+%V Leadership"',
  'Rune Chant':'Section=magic Note="+3 DC divine spells when tracing rune"',
  'Rune Craft':'Section=skill Note="+%V Craft (inscribing runes)"',
  'Rune Power':'Section=magic Note="+%V DC of runes"',
  'Sacred Defense':'Section=save Note="+%V vs. divine spells and outsiders"',
  'Scribe Tattoo':'Section=magic Note="Induct novices into circle"',
  'Shadow Defense':
    'Section=save ' +
    'Note="+%V vs. Enchantment, Illusion, Necromancy, and Darkness spells"',
  'Shadow Double':'Section=magic Note="Create clone lasting %V rd 1/dy"',
  'Shield Of Shadows':
    'Section=magic Note="<i>Shield</i> w/75% concealment %V rd/dy"',
  'Smite Infidel':
    'Section=combat ' +
    'Note="+%V attack, +%1 damage vs. foe w/different deity 1/dy"',
  'Specialist Defense':
    'Section=save Note="+%V bonus on saves vs. specialist school spells"',
  'Spell Power':'Section=magic Note="+%V spell DC and resistance checks"',
  'Spell-Like Ability':'Section=magic Note="Use spell as ability 2+/dy"',
  'Thwart Glyph':
    'Section=skill Note="+4 Disable Device (glyphs, runes, and symbols)/+4 Search (glyphs, runes, and symbols)"',
  'Transcendence':
    'Section=magic,skill ' +
    'Note="Chosen <i>Protection</i> spell at will",' +
         '"+2 charisma checks w/followers of %V"',
  "Tymora's Smile":
    'Section=save Note="+2 luck bonus to any save 1/dy"'
};
RealmsPrestige.SPELLS = {
  'Alter Self':'Level=Harper1',
  'Cat\'s Grace':'Level=Harper2',
  'Cause Fear':'Level=Hathran1,Purple3',
  'Charm Person':'Level=Harper1',
  'Clairaudience/Clairvoyance':'Level=Harper3',
  'Comprehend Languages':'Level=Harper1',
  'Darkvision':'Level=Harper2',
  'Detect Thoughts':'Level=Harper2',
  'Eagle\'s Splendor':'Level=Harper2',
  'Erase':'Level=Harper1',
  'Feather Fall':'Level=Harper1',
  // Since Flashburst is already a W3 spell, no need to make it Hathran3
  'Greater Command':'Level=Hathran4',
  'Invisibility':'Level=Harper2',
  'Jump':'Level=Harper1',
  'Knock':'Level=Harper2',
  'Light':'Level=Harper1',
  'Locate Creature':'Level=Seeker4',
  'Locate Object':'Level=Harper2,Seeker3',
  'Magic Mouth':'Level=Harper2',
  'Message':'Level=Harper1',
  'Misdirection':'Level=Harper2',
  'Moon Blade':'Level=Hathran3',
  'Moon Path':'Level=Hathran5',
  'Moonbeam':'Level=Hathran2',
  'Mount':'Level=Harper1',
  'Nondetection':'Level=Harper3',
  'Obscure Object':'Level=Seeker3',
  'Read Magic':'Level=Harper1',
  'Sanctuary':'Level=Seeker1',
  // Making Scratterspray a Hathran1 spell would confuse the acquisition of
  // Hathran Fear. Since it's already a W1 spell, there's no need.
  'Scatterspray':'Level=Harper1',
  'See Invisibility':'Level=Harper2',
  'Shadow Mask':'Level=Harper2',
  'Shadow Walk':'Level=Shadow4',
  'Sleep':'Level=Harper1',
  'Spider Climb':'Level=Harper1',
  'Suggestion':'Level=Harper3',
  'Tongues':'Level=Harper3',
  'Undetectable Alignment':'Level=Harper3'
};

/* Defines rules related to basic character identity. */
RealmsPrestige.identityRules = function(rules, classes) {
  QuilvynUtils.checkAttrTable
    (classes, ['Require', 'HitDie', 'Attack', 'SkillPoints', 'Fortitude', 'Reflex', 'Will', 'Skills', 'Features', 'Selectables', 'Languages', 'CasterLevelArcane', 'CasterLevelDivine', 'SpellAbility', 'SpellSlots']);
  for(var clas in classes) {
    rules.choiceRules(rules, 'Class', clas, classes[clas]);
    RealmsPrestige.classRulesExtra(rules, clas);
  }
};

/* Defines rules related to magic use. */
RealmsPrestige.magicRules = function(rules, spells) {
  QuilvynUtils.checkAttrTable(spells, ['School', 'Level', 'Description']);
  for(var s in spells) {
    rules.choiceRules(rules, 'Spell', s, Realms.SPELLS[s] + ' ' + spells[s]);
  }
};

/* Defines rules related to character aptitudes. */
RealmsPrestige.talentRules = function(rules, features) {
  QuilvynUtils.checkAttrTable(features, ['Section', 'Note']);
  for(var feature in features) {
    rules.choiceRules(rules, 'Feature', feature, features[feature]);
  }
};

RealmsPrestige.classRulesExtra = function(rules, name) {

  var allFeats = rules.getChoices('feats');
  var allSchools = rules.getChoices('schools');
  var feats = null;

  if(allFeats == null) {
    console.log('feats not available for prestige class "' + name + '"');
    return;
  }
  if(allSchools == null) {
    console.log('schools not available for prestige class "' + name + '"');
    return;
  }

  if(name == 'Arcane Devotee') {

    feats = [
      'Greater Spell Penetration', 'Improved Counterspell',
      'Magical Artisan', 'Shadow Weave Magic', 'Spell Penetration'
    ];
    for(var school in allSchools) {
      if(school != 'Universal') {
        feats.push('Greater Spell Focus (' + school + ')');
        feats.push('Spell Focus (' + school + ')');
      }
    }

    rules.defineRule('featCount.Arcane Devotee',
      'levels.Arcane Devotee', '+=', 'source >= 3 ? 1 : null'
    );
    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Arcane Devotee', '+=', null);
    rules.defineRule('magicNotes.freelyEnlargeSpell',
      'charismaModifier', '+=', 'source > 0 ? source + 1 : 1'
    );
    rules.defineRule
      ('saveNotes.divineShroud', 'casterLevelArcane', '+=', '12 + source');
    rules.defineRule
      ('saveNotes.divineShroud.1', 'charismaModifier', '+=', '5 + source');
    rules.defineRule('saveNotes.sacredDefense',
      'levels.Arcane Devotee', '+=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Archmage') {

    var allSpells = rules.getChoices('spells');
    var matchInfo;
    for(var spell in allSpells) {
      if((matchInfo = spell.match(/\(\w+5 (\w+)\)/)) != null) {
        var school = matchInfo[1];
        rules.defineRule
          ('level5' + school + 'Spells', 'spells.' + spell, '+=', '1');
        rules.defineRule
          ('level5SpellSchools', 'level5' + school + 'Spells', '+=', '1');
      }
    }
    rules.choiceRules
      (rules, 'Feat', 'Skill Focus (Spellcraft)', 'Type=General');
    rules.defineRule('features.Spell Power',
      'features.Spell Power +1', '=', '1',
      'features.Spell Power +2', '=', '1',
      'features.Spell Power +3', '=', '1'
    );
    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Archmage', '+=', null);
    rules.defineRule('magicNotes.spellPower',
      'features.Spell Power +1', '+=', '1',
      'features.Spell Power +2', '+=', '2',
      'features.Spell Power +3', '+=', '3'
    );
    rules.defineRule
      ('selectableFeatureCount.Archmage', 'levels.Archmage', '+=', null);
    rules.defineRule('spellSlots.S5',
      'archmageFeatures.Spell Power +1', '+', '-1',
      'archmageFeatures.Spell-Like Ability', '+', '-1'
    );
    rules.defineRule('spellSlots.W5',
      'archmageFeatures.Spell Power +1', '+', '-1',
      'archmageFeatures.Spell-Like Ability', '+', '-1'
    );
    rules.defineRule
      ('spellSlots.S6', 'archmageFeatures.Mastery Of Shaping', '+', '-1');
    rules.defineRule
      ('spellSlots.W6', 'archmageFeatures.Mastery Of Shaping', '+', '-1');
    rules.defineRule('spellSlots.S7',
      'archmageFeatures.Arcane Reach', '+', '-1',
      'archmageFeatures.Improved Arcane Reach', '+', '-1',
      'archmageFeatures.Mastery Of Counterspelling', '+', '-1',
      'archmageFeatures.Spell Power +2', '+', '-1'
    );
    rules.defineRule('spellSlots.W7',
      'archmageFeatures.Arcane Reach', '+', '-1',
      'archmageFeatures.Improved Arcane Reach', '+', '-1',
      'archmageFeatures.Mastery Of Counterspelling', '+', '-1',
      'archmageFeatures.Spell Power +2', '+', '-1'
    );
    rules.defineRule
      ('spellSlots.S8', 'archmageFeatures.Mastery Of Elements', '+', '-1');
    rules.defineRule
      ('spellSlots.W8', 'archmageFeatures.Mastery Of Elements', '+', '-1');
    rules.defineRule('spellSlots.S9',
      'archmageFeatures.Arcane Fire', '+', '-1',
      'archmageFeatures.Spell Power +3', '+', '-1'
    );
    rules.defineRule('spellSlots.W9',
      'archmageFeatures.Arcane Fire', '+', '-1',
      'archmageFeatures.Spell Power +3', '+', '-1'
    );

  } else if(name == 'Divine Champion') {

    rules.defineRule('combatNotes.divineWrath', 'charismaModifier', '=', null);
    rules.defineRule('combatNotes.smiteInfidel',
      'charismaModifier', '=', 'source > 0 ? source : 0'
    );
    rules.defineRule('combatNotes.smiteInfidel.1',
      'levels.Divine Champion', '=', null
    );
    rules.defineRule('featCount.Fighter',
      'levels.Divine Champion', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('magicNotes.healTheFlock',
      'levels.Divine Champion', '=', null,
      'charismaModifier', '*', null,
      'charisma', '?', 'source >= 12'
    );
    rules.defineRule('magicNotes.healTheFlock.1',
      'features.Heal The Flock', '?', null,
      'deity', '=', null
    );
    rules.defineRule('saveNotes.divineWrath', 'charismaModifier', '=', null);
    rules.defineRule('saveNotes.sacredDefense',
      'levels.Divine Champion', '+=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Divine Disciple') {

    rules.defineRule
      ('selectableFeatureCount.Cleric', 'featureNotes.newDomain', '+=', '1');
    rules.defineRule('magicNotes.casterLevelBonus',
      'levels.Divine Disciple', '+=', null
    );
    rules.defineRule('saveNotes.sacredDefense',
      'levels.Divine Disciple', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('skillNotes.transcendence',
      'deity', '=', 'source.replace(/\\s*\\(.*\\)/, "")'
    );

  } else if(name == 'Divine Seeker') {

    rules.defineRule('combatNotes.sneakAttack',
      'levels.Divine Seeker', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.sacredDefense',
      'levels.Divine Seeker', '+=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Guild Thief') {

    feats = [
      'Alertness', 'Blind-Fight', 'Cosmopolitan', 'Education', 'Leadership',
      'Lightning Reflexes', 'Still Spell', 'Street Smart', 'Weapon Finesse',
      'Weapon Proficiency (Hand Crossbow)'
    ];
    if('Track' in allFeats)
      feats.push('Track');
    for(var feat in allFeats) {
      if(feat.match(/(Skill|Weapon)\sFocus/))
        feats.push(feat);
    }

    rules.defineRule('combatNotes.improvedUncannyDodge',
      'levels.Guild Thief', '+=', null,
      '', '+', '4'
    );
    rules.defineRule('combatNotes.sneakAttack',
      'levels.Guild Thief', '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('featCount.Guild Thief',
      'levels.Guild Thief', '=', 'source < 2 ? null : Math.floor(source / 2)'
    );
    rules.defineRule('featureNotes.reputation',
      'levels.Guild Thief', '=', 'source >= 3 ? source - 2 : null'
    );

  } else if(name == 'Harper Scout') {

    rules.defineRule('combatNotes.favoredEnemy',
      'levels.Harper Scout', '+=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule('featCount.General',
      'levels.Harper Scout', '+=', 'source >= 2 ? 2 : null'
    );
    rules.defineRule
      ('skillNotes.bardicKnowledge', 'levels.Harper Scout', '+=', null);
    rules.defineRule('skillNotes.favoredEnemy',
      'levels.Harper Scout', '+=', '1 + Math.floor(source / 4)'
    );
    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'harperSkillFocus', 'features.Harper Skill Focus',
      'Sum \'features.Skill Focus\' >= 1'
    );
    QuilvynRules.prerequisiteRules(
      rules, 'validation', 'harperPerformFocus','features.Harper Perform Focus',
      'Sum \'features.Skill Focus .Perform\' >= 1'
    );

  } else if(name == 'Hathran') {

    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Hathran', '+=', null);

  } else if(name == 'Hierophant') {

    rules.defineRule
      ('selectableFeatureCount.Hierophant', 'levels.Hierophant', '=', null);
    rules.defineRule('combatNotes.turnUndead.1',
      'combatNotes.masteryOfEnergy', '+', '4'
    );
    rules.defineRule('combatNotes.turnUndead.2',
      'combatNotes.masteryOfEnergy', '+', '4'
    );
    rules.defineRule('magicNotes.faithHealing.1',
      'features.Faith Healing', '?', null,
      'deity', '=', null
    );
    rules.defineRule
      ('features.Spell Power', 'features.Spell Power +2', '=', '1');
    rules.defineRule
      ('magicNotes.spellPower', 'features.Spell Power +2', '+=', '2');

  } else if(name == 'Purple Dragon Knight') {

    rules.defineRule('combatNotes.finalStand',
      'levels.Purple Dragon Knight', '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule('combatNotes.finalStand.1',
      'levels.Purple Dragon Knight', '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule("magicNotes.knight'sCourage",
      'levels.Purple Dragon Knight', '=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Red Wizard') {

    rules.defineRule('sumItemCreationAndMetamagicFeats',
      'sumItemCreationFeats', '=', null,
      'sumMetamagicFeats', '+', null
    );
    rules.defineRule
      ('featCount.Wizard', 'levels.Red Wizard', '+=', 'source>=5 ? 1 : null');
    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Red Wizard', '+=', null);
    rules.defineRule('magicNotes.spellPower',
      'levels.Red Wizard', '+=', 'Math.floor(source / 2)'
    );
    rules.defineRule('saveNotes.specialistDefense',
      'levels.Red Wizard', '+=',
      'Math.floor((source + 1) / 2) - (source >= 5 ? 1 : 0)'
    );
    rules.defineRule('selectableFeatureCount.Wizard',
      'magicNotes.enhancedSpecialization', '+', '1'
    );

  } else if(name == 'Runecaster') {

    rules.defineRule
      ('magicNotes.casterLevelBonus', 'levels.Runecaster', '+=', null);
    rules.defineRule('magicNotes.runePower',
      'levels.Runecaster', '=', 'source >= 9 ? 3 : source >= 5 ? 2 : 1'
    );
    rules.defineRule('skillNotes.runeCraft',
      'levels.Runecaster', '=', 'source>=7 ? 3 : Math.floor((source + 2) / 3)'
    );

  } else if(name == 'Shadow Adept') {

    rules.defineRule('featCount.Metamagic',
      'levels.Shadow Adept', '+=', 'source >= 5 ? 1 : null'
    );
    rules.defineRule
      ('magicNotes.insidiousMagic', 'casterLevel', '=', 'source + 11');
    rules.defineRule('magicNotes.perniciousMagic', 'casterLevel', '=', 'source + 11');
    rules.defineRule
      ('magicNotes.shieldOfShadows', 'casterLevel', '=', null);
    rules.defineRule
      ('magicNotes.shadowDouble', 'casterLevel', '=', null);
    rules.defineRule('magicNotes.spellPower',
      'levels.Shadow Adept', '+=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('magicNotes.tenaciousMagic', 'casterLevel', '=', '15 + source');
    rules.defineRule('saveNotes.greaterShieldOfShadows',
      'levels.Shadow Adept', '=', 'source + 12'
    );
    rules.defineRule('saveNotes.shadowDefense',
      'levels.Shadow Adept', '=', 'Math.floor((source + 1) / 3)'
    );

  }

  if(feats != null) {
    for(var j = 0; j < feats.length; j++) {
      var feat = feats[j];
      if(!(feat in allFeats)) {
        console.log
          ('feat "' + feat + '" undefined for prestige class "' + name + '"');
        continue;
      }
      allFeats[feat] = allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
  }

};
