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
 * This module loads the rules from the Forgotten Realms Campaign Setting (3.0)
 * source book. The Realms function contains methods that load rules for
 * particular parts of the rule book: raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the Realms rules. Similarly, the constant fields of Realms
 * (DEITIES, FEATS, etc.) can be manipulated to modify the user's choices. If
 * #baseRules# contains "Pathfinder", the Pathfinder plugin is used as the
 * basis for the Realms rule set; otherwise, the SRD35 plugin is used.
 */
function Realms(baseRules) {

  if(window.SRD35 == null) {
    alert('The Realms module requires use of the SRD35 module');
    return;
  }

  Realms.USE_PATHFINDER =
    window.Pathfinder != null && Pathfinder.SRD35_SKILL_MAP &&
    baseRules != null && baseRules.includes('Pathfinder');

  var rules = new QuilvynRules(
    'Forgotten Realms - ' + (Realms.USE_PATHFINDER ? 'Pathfinder 1E' : 'D&D v3.5'),
     Realms.VERSION
  );
  rules.basePlugin = Realms.USE_PATHFINDER ? Pathfinder : SRD35;
  Realms.rules = rules;

  Realms.CHOICES = rules.basePlugin.CHOICES.concat(Realms.CHOICES_ADDED);
  rules.defineChoice('choices', Realms.CHOICES);
  rules.choiceEditorElements = Realms.choiceEditorElements;
  rules.choiceRules = Realms.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.getPlugins = Realms.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Realms.randomizeOneAttribute;
  Realms.RANDOMIZABLE_ATTRIBUTES =
    rules.basePlugin.RANDOMIZABLE_ATTRIBUTES.concat
    (Realms.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', Realms.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Realms.ruleNotes;

  if(rules.basePlugin == window.Pathfinder) {
    SRD35.ABBREVIATIONS['CMB'] = 'Combat Maneuver Bonus';
    SRD35.ABBREVIATIONS['CMD'] = 'Combat Maneuver Defense';
  }

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset',
    'race:Race,select-one,races', 'levels:Class Levels,bag,levels',
    'prestige:Prestige Levels,bag,prestiges', 'npc:NPC Levels,bag,npcs');

  Realms.ALIGNMENTS = Object.assign({}, rules.basePlugin.ALIGNMENTS);
  Realms.ANIMAL_COMPANIONS =
    Object.assign( {}, rules.basePlugin.ANIMAL_COMPANIONS);
  Realms.ARMORS = Object.assign({}, rules.basePlugin.ARMORS);
  Realms.CLASSES = Object.assign({}, rules.basePlugin.CLASSES);
  Realms.NPC_CLASSES = Object.assign({}, rules.basePlugin.NPC_CLASSES);
  Realms.FAMILIARS = Object.assign({}, rules.basePlugin.FAMILIARS);
  Realms.FEATS =
    Object.assign({}, rules.basePlugin.FEATS, Realms.FEATS_ADDED);
  Realms.FEATURES =
    Object.assign({}, rules.basePlugin.FEATURES, Realms.FEATURES_ADDED);
  Realms.GOODIES = Object.assign({}, rules.basePlugin.GOODIES);
  Realms.LANGUAGES =
    Object.assign({}, rules.basePlugin.LANGUAGES, Realms.LANGUAGES_ADDED);
  Realms.PATHS =
    Object.assign({}, rules.basePlugin.PATHS, Realms.PATHS_ADDED);
  Realms.DEITIES['None'] =
    'Domain=' + QuilvynUtils.getKeys(Realms.PATHS).filter(x => x.match(/Domain$/)).map(x => x.replace(' Domain', '')).join(',');
  Realms.RACES['Gold Dwarf'] =
    rules.basePlugin.RACES['Dwarf']
      .replace('Dwarf Ability', 'Gold Dwarf Ability')
      .replace('Dwarf Enmity', 'Gold Dwarf Enmity'),
  Realms.RACES['Gray Dwarf'] =
    rules.basePlugin.RACES['Dwarf']
      .replace('Common', 'Undercommon')
      .replace('Dwarf Ability Adjustment', 'Gray Dwarf Ability Adjustment')
      .replace(/['"]?Darkvision['"]?/, '"Extended Darkvision"')
      .replace('Features=', 'Features="Duergar Alertness","Gray Dwarf Immunities","Light Sensitivity","Race Level Adjustment","Stealthy Movement",') + ' ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Duergaren1:1=1,' +
      'Duergaren2:1=1';
  Realms.RACES['Shield Dwarf'] =
    rules.basePlugin.RACES['Dwarf'],
  Realms.RACES['Drow Elf'] =
    rules.basePlugin.RACES['Elf']
      .replace('Common', 'Undercommon')
      .replace('Elf Ability Adjustment', 'Drow Elf Ability Adjustment')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace(/Weapon Proficiency[^'"]*/, 'Weapon Proficiency (Hand Crossbow/Light Crossbow/Rapier/Shortsword)')
      .replace('Features=', 'Features="Drow Elf Spell Resistance","Light Blindness","Light Sensitivity","Race Level Adjustment","Strong Will",') + ' ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      '"Drowen0:1=1",' +
      '"Drowen1:1=1",' +
      '"Drowen2:1=1"';
  Realms.RACES['Moon Elf'] =
    rules.basePlugin.RACES['Elf'],
  Realms.RACES['Sun Elf'] =
    rules.basePlugin.RACES['Elf'].replace('Elf Ability', 'Sun Elf Ability'),
  Realms.RACES['Wild Elf'] =
    rules.basePlugin.RACES['Elf'].replace('Elf Ability', 'Wild Elf Ability'),
  Realms.RACES['Wood Elf'] =
    rules.basePlugin.RACES['Elf'].replace('Elf Ability', 'Wood Elf Ability'),
  Realms.RACES['Deep Gnome'] =
    rules.basePlugin.RACES['Gnome']
      .replace('Common', 'Undercommon')
      .replace('Gnome Ability Adjustment', 'Deep Gnome Ability Adjustment')
      .replace('Dodge Giants', 'Exceptional Dodge')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace('Features=', 'Features="Extra Luck","Know Depth","Race Level Adjustment",Shadowed,Stonecunning,"Svirfneblin Spell Resistance",Undetectable,') + ' ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Svirfneblinish1:1=1,' +
      'Svirfneblinish2:1=2,' +
      'Svirfneblinish3:1=1';
  Realms.RACES['Rock Gnome'] =
    rules.basePlugin.RACES['Gnome'],
  Realms.RACES['Half-Elf'] =
    rules.basePlugin.RACES['Half-Elf'],
  Realms.RACES['Half-Orc'] =
    rules.basePlugin.RACES['Half-Orc'],
  Realms.RACES['Ghostwise Halfling'] =
    rules.basePlugin.RACES['Halfling']
      .replace(/['"]?Fortunate['"]?/, '"Speak Without Sound"'),
  Realms.RACES['Lightfoot Halfling'] =
    rules.basePlugin.RACES['Halfling'],
  Realms.RACES['Strongheart Halfling'] =
    rules.basePlugin.RACES['Halfling']
      .replace(/['"]?Fortunate['"]?/, '"Strongheart Extra Feat"'),
  Realms.RACES['Human'] =
    rules.basePlugin.RACES['Human'],
  Realms.SCHOOLS = Object.assign({}, rules.basePlugin.SCHOOLS);
  Realms.SHIELDS = Object.assign({}, rules.basePlugin.SHIELDS);
  Realms.SKILLS = Object.assign({}, rules.basePlugin.SKILLS);
  Realms.SPELLS = Object.assign
    ({}, Realms.USE_PATHFINDER ? Pathfinder.SPELLS :
         window.PHB35 != null ? PHB35.SPELLS : SRD35.SPELLS,
     Realms.SPELLS_ADDED);
  for(var s in Realms.SPELLS_LEVELS) {
    var levels = Realms.SPELLS_LEVELS[s];
    if(!(s in Realms.SPELLS)) {
      if(window.PHB35 && PHB35.SPELL_RENAMES && s in PHB35.SPELL_RENAMES) {
        s = PHB35.SPELL_RENAMES[s];
      } else {
        console.log('Missing spell "' + s + '"');
        continue;
      }
    }
    Realms.SPELLS[s] =
      Realms.SPELLS[s].replace('Level=', 'Level=' + levels + ',');
  }
  Realms.WEAPONS =
    Object.assign({}, rules.basePlugin.WEAPONS, Realms.WEAPONS_ADDED);

  Realms.abilityRules(rules);
  Realms.aideRules(rules, Realms.ANIMAL_COMPANIONS, Realms.FAMILIARS);
  Realms.combatRules(rules, Realms.ARMORS, Realms.SHIELDS, Realms.WEAPONS);
  Realms.magicRules(rules, Realms.SCHOOLS, Realms.SPELLS);
  // Feats must be defined before classes
  Realms.talentRules
    (rules, Realms.FEATS, Realms.FEATURES, Realms.GOODIES, Realms.LANGUAGES,
     Realms.SKILLS);
  Realms.identityRules(
    rules, Realms.ALIGNMENTS, Realms.CLASSES, Realms.DEITIES, Realms.PATHS,
    Realms.RACES, Realms.REGIONS, Realms.PRESTIGE_CLASSES, Realms.NPC_CLASSES
  );

  Quilvyn.addRuleSet(rules);

}

Realms.VERSION = '2.3.1.1';

// Realms uses PHB35 as its default base ruleset. If USE_PATHFINDER is true,
// the Realms function will instead use rules taken from the Pathfinder plugin.
Realms.USE_PATHFINDER = false;

Realms.CHOICES_ADDED = ['Region'];
Realms.CHOICES = SRD35.CHOICES.concat(Realms.CHOICES_ADDED);
Realms.RANDOMIZABLE_ATTRIBUTES_ADDED = ['region'];
Realms.RANDOMIZABLE_ATTRIBUTES =
  SRD35.RANDOMIZABLE_ATTRIBUTES.concat(Realms.RANDOMIZABLE_ATTRIBUTES_ADDED);

Realms.ALIGNMENTS = Object.assign({}, SRD35.ALIGNMENTS);
Realms.ANIMAL_COMPANIONS = Object.assign({}, SRD35.ANIMAL_COMPANIONS);
Realms.ARMORS = Object.assign({}, SRD35.ARMORS);
Realms.CLASSES = Object.assign({}, SRD35.CLASSES);
Realms.NPC_CLASSES = Object.assign({}, SRD35.NPC_CLASSES);
Realms.PRESTIGE_CLASSES = {
  'Arcane Devotee':
    'Require=' +
      '"features.Enlarge Spell","skills.Knowledge (Religion) >= 8",' +
      '"skills.Spellcraft >= 8","spellSlots.B4||spellSlots.S4||spellSlots.W4" '+
    'HitDie=d4 Attack=1/2 SkillPoints=2 Fortitude=1/3 Reflex=1/3 Will=1/2 ' +
    'Skills=' +
      // 3.0 Alchemy, Scry => 3.5 Craft (Alchemy), null
      'Concentration,Craft,Knowledge,Profession,Spellcraft ' +
    'Features=' +
      '"1:Caster Level Bonus","1:Devotee Enlarge Spell","2:Alignment Focus",' +
      '"2:Sacred Defense","3:Arcane Devotee Bonus Feats","5:Divine Shroud"',
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
    'Features="1:Caster Level Bonus","1:High Arcana" ' +
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
      '"1:Armor Proficiency (Medium)","1:Shield Proficiency",' +
      '"1:Weapon Proficiency (Martial)",' +
      '"1:Champion Lay On Hands","2:Divine Champion Bonus Feats",' +
      '"2:Sacred Defense","3:Smite Infidel","5:Divine Wrath"',
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
      '1:Sanctuary,"1:Thwart Glyph","2:Sacred Defense","2:Sneak Attack",' +
      '"3:Locate Object","3:Obscure Object","5:Divine Perseverance",' +
      '"5:Locate Creature"',
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
      '"1:Sneak Attack",1:Doublespeak,"2:Guild Thief Bonus Feats",' +
      '"2:Uncanny Dodge",3:Reputation,"5:Improved Uncanny Dodge"',
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
      'Perform,Profession,"Sense Motive","Sleight Of Hand","Speak Language",' +
      'Survival,Swim,Tumble ' +
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
      '"1:Caster Level Bonus","1:Cohort","1:Place Magic",3:Fear,' +
      '"4:Circle Leader","10:Greater Command"',
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
    'Features=' +
      '"1:Hierophant Special Abilities" ' +
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
      '"Armor Proficiency (Medium)","Shield Proficiency",' +
      '"Weapon Proficiency (Simple)",' +
      '"1:Heroic Shield","1:Rallying Cry","2:Inspire Knight\'s Courage",' +
      '"3:Fear","4:Oath Of Wrath","5:Final Stand"',
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
      '"5:Red Wizard Bonus Feats","7:Scribe Tattoo","10:Great Circle Leader"',
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
      '"1:Caster Level Bonus","1:Shadow Feats","2:Low-Light Vision",' +
      '"2:Shadow Defense","3:Spell Power","4:Shield Of Shadows",' +
      '"5:Shadow Adept Bonus Feats",7:Darkvision,"7:Shadow Walk",' +
      '"8:Greater Shield Of Shadows","10:Shadow Double"'
};
Realms.FAMILIARS = Object.assign({}, SRD35.FAMILIARS);
Realms.FEATS_ADDED = {
  'Arcane Preparation':'Type=General Require="levels.Bard || levels.Sorcerer"',
  'Arcane Schooling':
    'Type=General ' +
    'Require="region =~ \'Chessenta|Halruaa|Lantan|Mulhorand|Unther\'"',
  'Artist':
    'Type=General ' +
    'Imply="Sum \'skills.Perform\' > 0 || Sum \'skills.Craft\' > 0" ' +
    'Require="region =~ \'Chessenta|Evermeet|Waterdeep|Rock Gnome\'"',
  'Blooded':
    'Type=General ' +
    'Require="region =~ \'Dalelands|Nelanther Isles|Sembia|Silverymoon|Tethyr|Vaasa\'"',
  'Bloodline Of Fire':'Type=General Require="region == \'Calimshan\'"',
  'Bullheaded':
    'Type=General ' +
    'Require="region =~ \'Damara|Dragon Coast|Great Dale|Moonshaes|Narfell|Nelanther Isles|Rashemen|Vaasa|Western Heartlands|Gold Dwarf|Gray Dwarf|Shield Dwarf\'"',
  'Cosmopolitan':'Type=General Require="region =~ \'Amn|Waterdeep\'"',
  'Courteous Magocracy':
    'Type=General ' +
    'Require="skills.Diplomacy||skills.Spellcraft",' +
            '"region =~ \'Evermeet|Halruaa\'"',
  'Create Portal':'Type="Item Creation" Require="features.Craft Wondrous Item"',
  'Daylight Adaptation':
    'Type=General Require="region =~ \'Drow|Gray Dwarf|Orc\'"',
  'Delay Spell':
    'Type=Metamagic Imply="casterLevel >= 1" Require="sumMetamagicFeats >= 1"',
  'Discipline':
    'Type=General ' +
    'Require="region =~ \'Aglarond|Anauroch|Cormyr|Impiltur|Thay|Strongheart Halfling|Sun Elf|Rock Gnome\'"',
  'Education':
    'Type=General ' +
    'Require="region =~ \'Amn|Chessenta|Cormyr|Evermeet|Lantan|Mulhorand|Sembia|Silverymoon|Waterdeep|Moon Elf|Sun Elf\'"',
  'Ethran':
    'Type=General ' +
    'Require="charisma >= 11",' +
            '"casterLevel >= 1",' +
            '"gender == \'Female\'",' +
            '"region == \'Rashemen\'"',
  'Foe Hunter':
    'Type=Fighter ' +
    'Require="region =~ \'Chult|Cormyr|Damara|Lake Of Steam|The North|Moonsea|Tashalar|Thethyr|Vaasa|Shield Dwarf|Wood Elf\'"',
  'Forester':
    'Type=General ' +
    'Require="region =~ \'Chondalwood|Dalelands|Great Dale|High Forest|Ghostwise Halfling|Moon Elf|Wild Elf|Wood Elf\'"',
  'Horse Nomad':
    'Type=Fighter Require="region =~ \'Hordelands|The Shaar|Vaasa\'"',
  'Innate Spell':
    'Type=General ' +
    'Require="features.Quicken Spell",' +
            '"features.Silent Spell",' +
            '"features.Still Spell"',
  'Inscribe Rune':
    'Type="Item Creation" ' +
    'Require=' +
      '"intelligence >= 13","casterLevelDivine >= 3",' +
      // Note Figure any Craft provides "appropriate Craft skill"
      '"Sum \'skills.Craft\' > 0"',
  'Insidious Magic':'Type=Metamagic Require="features.Shadow Weave Magic"',
  'Luck Of Heroes':
    'Type=General Require="region =~ \'Aglarond|Dalelands|Tethyr|The Vast\'"',
  'Magical Artisan':
    'Type=General Imply="casterLevel >= 1" Require="sumItemCreationFeats >= 1"',
  'Magical Training':
    'Type=General Require="intelligence >= 10","region == \'Halruaa\'"',
  'Mercantile Background':
    'Type=General ' +
    'Require="skills.Appraise > 0||Sum \'skills.Craft\' > 0||Sum \'skills.Profession\' > 0",' +
            '"region =~ \'Impiltur|Lake Of Steam|Lantan|Sembia|Tashalar|Tethyr|Thesk|The Vast|Deep Gnome|Gray Dwarf\'"',
  'Militia':
    'Type=General ' +
    'Require="region =~ \'Dalelands|Impiltur|Luiren|Strongheart Halfling\'"',
  'Mind Over Body':
    'Type=General ' +
    'Imply="intelligenceModifier >= constitutionModifier" ' +
    'Require="region =~ \'Calimshan|Thay|Moon Elf|Sun Elf\'"',
  'Pernicious Magic':'Type=Metamagic Require="features.Shadow Weave Magic"',
  'Persistent Spell':'Type=Metamagic Require="features.Extend Spell"',
  'Resist Poison Feat':
    'Type=General Require="region =~ \'Gray Dwarf|Half-Orc|Orc\'"',
  'Saddleback':
    'Type=Fighter ' +
    'Require="region =~ \'Cormyr|Hordelands|Narfell|The North|Western Heartlands\'"',
  'Shadow Weave Magic':
    'Type=General ' +
    'Imply="casterLevel >= 1" ' +
    'Require="wisdom >= 13 || deity == \'Shar\'"',
  'Signature Spell':'Type=General Require="features.Spell Mastery"',
  'Silver Palm':
    'Type=General ' +
    'Require="region =~ \'Amn|Dragon Coast|Great Dale|Impiltur|Moonsea|Sembia|The Shaar|Thesk|Vilhon Reach|Gold Dwarf|Gray Dwarf\'"',
  'Smooth Talk':
    'Type=General ' +
    'Require="region =~ \'Luiren|Silverymoon|Thesk|Waterdeep|Gold Dwarf|Lightfoot Halfling\'"',
  'Snake Blood':
    'Type=General Require="region =~ \'Chult|Tashalar|Vilhon Reach\'"',
  'Spellcasting Prodigy (Bard)':'Type=General Imply="levels.Bard >= 1"',
  'Spellcasting Prodigy (Cleric)':'Type=General Imply="levels.Cleric >= 1"',
  'Spellcasting Prodigy (Druid)':'Type=General Imply="levels.Druid >= 1"',
  'Spellcasting Prodigy (Sorcerer)':'Type=General Imply="levels.Sorcerer >= 1"',
  'Spellcasting Prodigy (Wizard)':'Type=General Imply="levels.Wizard >= 1"',
  'Stealthy':
    'Type=General ' +
    'Require="region =~ \'Drow Elf|Half-Orc|Ghostwise Halfling|Lightfoot Halfling|Strongheart Halfling\'"',
  'Street Smart':
    'Type=General ' +
    'Require="region =~ \'Amn|Calimshan|Chessenta|Moonsea|Unther\'"',
  'Strong Soul':
    'Type=General ' +
    'Require="region =~ \'Dalelands|Moonshaes|Deep Gnome|Ghostwise Halfling|Lightfoot Halfling|Moon Elf|Rock Gnome|Strongheart Halfling|Sun Elf|Wild Elf|Wood Elf\'"',
  'Survivor':
    'Type=General ' +
    'Require="region =~ \'Anauroch|Chondalwood|Chult|Damara|Hordelands|Moonshaes|Narfell|The North|The Shaar|Rashemen|Silverymoon|Vaasa|Vilhon Reach|Western Heartlands|Deep Gnome|Drow Elf|Lightfoot Halfling|Ghostwise Halfling|Shield Dwarf|Wild Elf\'"',
  'Tattoo Focus':
    'Type=General ' +
    'Require="levels.Wizard >= 1",' +
            '"features.School Specialization (None) == 0",' +
            '"region == \'Thay\'"',
  'Tenacious Magic':
    'Type=Metamagic ' +
    'Imply="casterLevel >= 1" ' +
    'Require="features.Shadow Weave Magic"',
  'Thug':
    'Type=General ' +
    'Require="region =~ \'Calimshan|Dragon Coast|Moonsea|Nelanther Isles|Unther|The Vast|Vilhon Reach|Waterdeep\'"',
  'Thunder Twin':'Type=General Require="region =~ \'Gold Dwarf|Shield Dwarf\'"',
  'Treetopper':
    'Type=General ' +
    'Require="region =~ \'Aglarond|Chondalwood|High Forest|Ghostwise Halfling|Wild Elf|Wood Elf\'"',
  'Twin Spell':
    'Type=Metamagic Imply="casterLevel >= 1" Require="sumMetamagicFeats >= 1"',
  'Twin Sword Style':
    'Type=Fighter ' +
    'Require="features.Two-Weapon Fighting",' +
            '"region =~ \'Sembia|Waterdeep|Drow Elf\'"',
  'Weapon Proficiency (Hand Crossbow)':
    'Type=General Require="baseAttack >= 1" Imply="weapons.Hand Crossbow"'
};
Realms.FEATS = Object.assign({}, SRD35.FEATS, Realms.FEATS_ADDED);
Realms.FEATURES_ADDED = {

  // Feat
  'Arcane Preparation':
    'Section=magic Note="Prepare arcane spell ahead of time"',
  'Arcane Schooling':'Section=magic Note="Designated arcane class is favored"',
  'Artist':'Section=skill Note="+2 Perform/+2 chosen Craft"',
  'Blooded':'Section=combat,skill Note="+2 Initiative","+2 Spot"',
  'Bloodline Of Fire':
    'Section=magic,save ' +
    'Note="+2 DC Sorcerer fire spells","+4 vs. fire effects"',
  'Bullheaded':'Section=save,skill Note="+1 Will","+2 Intimidate"',
  'Cosmopolitan':
    'Section=skill Note="Chosen skill is class skill/+2 chosen skill checks"',
  'Courteous Magocracy':'Section=skill Note="+2 Diplomacy/+2 Spellcraft"',
  'Create Portal':'Section=magic Note="Create magical portal"',
  'Daylight Adaptation':'Section=feature Note="No bright light penalties"',
  'Delay Spell':'Section=magic Note="Delay effect of spell 1-5 rd"',
  'Discipline':'Section=save,skill Note="+1 Will","+2 Concentration"',
  'Education':
    'Section=skill ' +
    'Note="All Knowledge is a class skill/+1 choice of 2 Knowledge skills"',
  // 3.0 Animal Empathy, Intuit Direction => 3.5 Handle Animal, Survival
  'Ethran':
    'Section=skill ' +
    'Note="+2 Handle Animal/+2 Survival/+2 Cha skills with Rashemi"',
  'Foe Hunter':
    'Section=combat Note="+1 damage, double critical range w/regional foe"',
  'Forester':'Section=skill Note="+2 Heal/+2 Survival"',
  // Identical to SRD35, but +3 DC instead of +1
  'Greater Spell Focus (%school)':'Section=magic Note="+3 Spell DC (%school)"',
  'Horse Nomad':
    'Section=combat,skill ' +
    'Note="Weapon Proficiency (Composite Shortbow)",' +
         '"+2 Ride"',
  'Innate Spell':
    'Section=magic ' +
    'Note="Designated spells as spell-like ability 1/rd uses +8 spell slot"',
  'Inscribe Rune':'Section=magic Note="Cast divine spell via rune"',
  'Insidious Magic':
    'Section=magic ' +
    'Note="DC 9+foe level check to detect Weave magic, foe DC %V check to detect Shadow Weave spell"',
  'Luck Of Heroes':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Magical Artisan':
    'Section=magic Note="Reduce item creation base price by 25%"',
  'Magical Training':
    'Section=magic ' +
    'Note="<i>Dancing Lights</i>, <i>Daze</i>, <i>Mage Hand</i> 1/dy"',
  'Mercantile Background':
    'Section=skill Note="+2 Appraise/+2 choice of Craft or Profession"',
  'Militia':
    'Section=combat ' +
    'Note="Weapon Proficiency (Longbow)/Weapon Proficiency (Longspear)"',
  'Militia Luiren':
    'Section=combat ' +
    'Note="Weapon Proficiency (Shortbow)/Weapon Proficiency (Short Sword)"',
  'Mind Over Body':
    'Section=combat ' +
    'Note="Intelligence modifier adds %1 HP, +%2 HP from Metamagic feats"',
  'Pernicious Magic':
    'Section=magic ' +
    'Note="Weave foes DC %V check to counterspell, DC 9+foe level to counterspell Weave foes"',
  'Persistent Spell':'Section=magic Note="Fixed-range spell lasts 24 hr"',
  'Resist Poison Feat':'Section=save Note="+4 vs. poison"',
  'Saddleback':'Section=skill Note="+3 Ride"',
  'Shadow Weave Magic':
    'Section=ability,magic ' +
    'Note="-2 Wisdom",' +
         '"+1 DC and resistance checks on enchantment, illusion, necromancy, and darkness descriptor spells, -1 caster level on evocation and transmutation, no light descriptor spells"',
  'Signature Spell':
    'Section=magic Note="Convert arcane spells into specified mastered spell"',
  'Silver Palm':'Section=skill Note="+2 Appraise/+2 Bluff"',
  'Smooth Talk':'Section=skill Note="+2 Diplomacy/+2 Sense Motive"',
  'Snake Blood':'Section=save Note="+1 Reflex/+2 vs. poison"',
  'Spellcasting Prodigy (Bard)':
    'Section=magic Note="+1 spell DC/+2 charisma for bonus spells"',
  'Spellcasting Prodigy (Cleric)':
    'Section=magic Note="+1 spell DC/+2 wisdom for bonus spells"',
  'Spellcasting Prodigy (Druid)':
    'Section=magic Note="+1 spell DC/+2 wisdom for bonus spells"',
  'Spellcasting Prodigy (Sorcerer)':
    'Section=magic Note="+1 spell DC/+2 charisma for bonus spells"',
  'Spellcasting Prodigy (Wizard)':
    'Section=magic Note="+1 spell DC/+2 intelligence for bonus spells"',
  'Stealthy':'Section=skill Note="+2 Hide/+2 Move Silently"',
  'Street Smart':'Section=skill Note="+2 Bluff/+2 Gather Information"',
  'Strong Soul':
    'Section=save Note="+1 Fortitude/+1 Will/+1 vs. draining and death"',
  'Survivor':'Section=save,skill Note="+1 Fortitude","+2 Survival"',
  'Tattoo Focus':
    'Section=magic ' +
    'Note="+1 DC and caster level vs. resistance w/specialization school spells"',
  'Tenacious Magic':
    'Section=magic ' +
    'Note="Weave foes DC %V to dispel, DC 13+foe level to dispel Weave foes"',
  'Thug':'Section=combat,skill Note="+2 Initiative","+2 Intimidate"',
  'Thunder Twin':
    'Section=ability,skill ' +
    'Note="+2 charisma checks",' +
         '"DC 15 Wisdom check to determine direction of twin"',
  'Treetopper':'Section=skill Note="+2 Climb"',
  'Twin Spell':'Section=magic Note="Affect as two spells uses +4 spell slot"',
  'Twin Sword Style':
    'Section=combat Note="+2 AC vs. chosen foe when using two swords"',

  // Path
  'Advanced Illusionist':
    'Section=magic Note="+1 caster level on Illusion spells"',
  'Cavern Stonecunning':
    'Section=skill Note="+2 Search (stone, metal), automatic check w/in 10\'"',
  'Compelling Magic':'Section=magic Note="+2 DC compulsion spells"',
  'Creator':
    'Section=magic,feature ' +
    'Note="+1 caster level creation spells",' +
         '"+1 General Feat (Skill Focus(chosen Craft))"',
  'Detect Portal':
    'Section=skill Note="DC 20 Search to detect in/active portals"',
  'Familial Protection':
    'Section=magic Note="R10\' %V targets +4 AC for %1 rd 1/dy"',
  'Hammer Specialist':
    'Section=feature ' +
    'Note="+2 General Feat (Weapon Proficiency and Focus w/chosen hammer)"',
  'Hated Foe':
    'Section=combat,save ' +
    'Note="+2 attack, AC vs. one foe for 1 min 1/dy",' +
         '"+2 saves vs. one foe for 1 min 1/dy"',
  'Inspire Allies':
    'Section=magic ' +
    'Note="+2 allies\' attack, damage, save, skill, and ability rolls for %V rd 1/dy"',
  'Mental Ward':
    'Section=magic ' +
    'Note="Touch to allow target +%V on next Will save for 1 hr 1/dy"',
  'Pain Touch':
    'Section=combat ' +
    'Note="Touch attack causes -2 Strength and Dexterity for 1 min 1/dy"',
  'Renew Self':
    'Section=combat Note="Recover 1d8+%V HP points when negative 1/dy"',
  'Skilled Caster':'Section=skill Note="+2 Concentration/+2 Spellcraft"',
  'Smite Power':
    'Section=combat Note="+%V damage (and +4 attack on dwarf or elf) 1/dy"',
  'Sneaky':'Section=skill Note="+2 Bluff/+2 Hide"',
  'Sprightly':
    'Section=skill Note="+%V Climb, Hide, Jump, Move Silently for 10 min 1/dy"',
  'Stormfriend':'Section=save Note="Resistance 5 to electricity"',
  'Strike Of Vengeance':
    'Section=combat Note="Strike for max damage after foe hit 1/dy"',
  'Trade Secrets':
    'Section=magic ' +
    'Note="<i>Detect Thoughts</i> on 1 target for %V min 1/dy (Will neg)"',
  'Turn On The Charm':'Section=ability Note="+4 charisma for 1 min 1/dy"',
  'Turn Lycanthropes':'Section=combat Note="Turn lycanthropes as undead"',
  'Turn Oozes':'Section=combat Note="Turn oozes as undead"',
  'Turn Reptiles':'Section=combat Note="Turn reptiles as undead"',
  'Turn Spiders':'Section=combat Note="Turn spiders as undead"',
  'Water Breathing':'Section=magic Note="Breathe water %V rd/dy"',

  // Race
  'Aasimar Ability Adjustment':'Section=ability Note="+2 Wisdom/+2 Charisma"',
  'Aasimar Alertness':'Section=skill Note="+2 Listen/+2 Spot"',
  'Aasimar Resistance':
    'Section=save Note="Resistance 5 to acid, cold, and electricity"',
  'Amphibious':'Section=feature Note="Breathe water at will"',
  'Air Genasi Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Wisdom/-2 Charisma"',
  'Breathless':
    'Section=save Note="Immune drowning, suffocation, inhalation effects"',
  'Control Flame':
    'Section=magic Note="R10\' Shrink or expand natural fire for 5 min 1/dy"',
  'Deep Gnome Ability Adjustment':
    'Section=ability Note="-2 Strength/+2 Dexterity/+2 Wisdom/-4 Charisma"',
  'Drow Elf Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Dexterity/-2 Constitution/+2 Intelligence/+2 Charisma"',
  'Drow Elf Spell Resistance':'Section=save Note="Spell resistance %V"',
  'Duergar Alertness':'Section=skill Note="+1 Listen/+1 Spot"',
  'Earth Genasi Ability Adjustment':
    'Section=ability Note="+2 Strength/+2 Constitution/-2 Wisdom/-2 Charisma"',
  'Elemental Affinity':'Section=save Note="+%V vs. %1 spells"',
  'Exceptional Dodge':'Section=combat Note="+4 AC"',
  'Extended Darkvision':'Section=feature Note="120\' b/w vision in darkness"',
  'Extra Luck':'Section=save Note="+2 Fortitude/+2 Reflex/+2 Will"',
  'Fire Genasi Ability Adjustment':
    'Section=ability Note="+2 Intelligence/-2 Charisma"',
  'Gold Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Dexterity"',
  'Gold Dwarf Enmity':'Section=combat Note="+1 attack vs. aberrations"',
  'Gray Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/-4 Charisma"',
  'Gray Dwarf Immunities':
    'Section=save ' +
    'Note="Immune to paralysis, phantasms, and magic and alchemical poisons"',
  'Light Blindness':'Section=feature Note="Blind 1 rd from sudden daylight"',
  'Light Sensitivity':
    'Section=combat,save,skill ' +
    'Note="-%V attack in bright light",' +
         '"-%V saves in bright light",' +
         '"-%V checks in bright light"',
  'Native Outsider':
    'Section=save Note="Affected by outsider target spells, not humanoid"',
  'Natural Swimmer':'Section=ability Note="Swim 30\'"',
  'Race Level Adjustment':'Section=ability Note="-%V Level"',
  'Sly':'Section=skill Note="+2 Hide"',
  'Shadowed':
    'Section=skill Note="+2 Hide/+4 Hide in darkened underground areas"',
  'Speak Without Sound':'Section=feature Note="R20\' Telepathic communication"',
  'Stealthy Movement':'Section=skill Note="+4 Move Silently"',
  'Strong Will':'Section=save Note="+2 Will vs. spells"',
  'Strongheart Extra Feat':'Section=feature Note="+1 General Feat"',
  'Sun Elf Ability Adjustment':
    'Section=ability Note="+2 Intelligence/-2 Constitution"',
  'Svirfneblin Spell Resistance':'Section=save Note="Spell resistance %V"',
  'Tiefling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Charisma"',
  'Tiefling Resistance':
    'Section=save Note="Resistance 5 to cold, electricity, and fire"',
  'Undetectable':'Section=magic Note="Continuous <i>Nondetection</i>"',
  'Water Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Charisma"',
  'Wild Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Intelligence"',
  'Wood Elf Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Strength/+2 Dexterity/-2 Constitution/-2 Intelligence/-2 Charisma"',

  // Prestige classes
  'Alignment Focus':
    'Section=magic ' +
    'Note="+1 caster level on spells from chosen alignment component"',
  'Arcane Devotee Bonus Feats':'Section=feature Note="%V Arcane Devotee feats"',
  'Arcane Fire':
    'Section=magic ' +
    'Note="R%1\' Convert arcane spell into a ranged touch %Vd6 + 1d6 x spell level bolt of fire"',
  'Arcane Reach':'Section=magic Note="R30\' Ranged touch with touch spell"',
  'Blast Infidel':
    'Section=magic ' +
    'Note="Negative energy spells vs. foe w/different deity have max effect"',
  'Caster Level Bonus':
    'Section=magic Note="+%V base class level for spells known and spells/dy"',
  'Champion Lay On Hands':'Section=magic Note="Heal followers of %1 %V HP/dy"',
  'Circle Leader':
    'Section=magic ' +
    'Note="1 hr ritual w/2-5 other members raises caster level, gives metamagic feats"',
  'Cohort':'Section=feature Note="Gain Ethran or Barbarian follower"',
  'Craft Harper Item':
    'Section=magic Note="Create magic instruments, Harper pins, and potions"',
  "Deneir's Eye":'Section=save Note="+2 vs. glyphs, runes, and symbols"',
  'Divine Champion Bonus Feats':'Section=feature Note="%V Fighter feats"',
  'Devotee Enlarge Spell':'Section=magic Note="x2 chosen spell range %V/dy"',
  'Divine Emissary':
    'Section=feature Note="R60\' Telepathy w/same-alignment outsider"',
  'Divine Perseverance':
    'Section=combat Note="Regain 1d8+5 HP from negative 1/dy"',
  'Divine Reach':'Section=magic Note="R30\' Ranged touch with touch spell"',
  'Divine Shroud':
    'Section=save Note="Aura provides spell resistance %V for %1 rd 1/dy"',
  'Divine Wrath':
    'Section=combat,save ' +
    'Note="+3 attack and damage and DR 5/- for %V rd 1/dy",' +
         '"+3 saves %V rd 1/dy",',
  // 3.0 Innuendo => 3.5 Bluff
  'Doublespeak':'Section=skill Note="+2 Bluff/+2 Diplomacy"',
  'Enhanced Specialization':'Section=magic Note="Additional opposition school"',
  'Faith Healing':
    'Section=magic Note="Healing spells on followers of %1 have max effect"',
  'Fear':
    'Section=magic ' +
    'Note="R30\' cone causes creatures to flee for %2 rd %V/dy (DC %1 Will shaken for 1 rd)"',
  'Final Stand':
    'Section=combat ' +
    'Note="R10\' %V allies gain 2d10 temporary HP for %V rd 1/dy"',
  'Gift Of The Divine':
    'Section=feature ' +
    'Note="Transfer some daily uses of turn or rebuke undead to another for 1-10 dy"',
  'Great Circle Leader':
    'Section=magic Note="Lead magic circle w/9 other members"',
  'Greater Command':
    'Section=magic ' +
    'Note="R%1\' %V targets in 15\' radius obey self commands to approach, drop, fall, flee, or halt for %V rd 1/dy (DC %2 Will neg)"',
  'Greater Shield Of Shadows':
    'Section=save Note="Shield Of Shadows gives spell resistance %V"',
  'Guild Thief Bonus Feats':'Section=feature Note="%V Guild Thief feats"',
  'Harper Perform Focus':
    'Section=feature ' +
    'Note="+1 General Feat (Skill Focus in chosen Perform)"',
  'Harper Skill Focus':
    'Section=feature ' +
    'Note="+1 General Feat (Skill Focus in Harper class skill)"',
  'Heroic Shield':'Section=combat Note="Aid Another action gives +4 AC bonus"',
  'Hierophant Special Abilities':'Section=feature Note="%V selections"',
  'High Arcana':'Section=feature Note="%V selections"',
  'Imbue With Spell Ability':
    'Section=magic ' +
    'Note="<i>Imbue With Spell Ability</i> 1st and 2nd level spells at will"',
  'Improved Arcane Reach':'Section=magic Note="R60\' Arcane Reach"',
  'Improved Divine Reach':'Section=magic Note="R60\' Divine Reach"',
  'Improved Runecasting':
    'Section=magic Note="Add charges and triggers to runes"',
  "Inspire Knight's Courage":
    'Section=magic ' +
    'Note="Allies +1 attack and damage, +2 charm and fear saves during speech +5 rd %V/dy"',
  "Lliira's Heart":'Section=save Note="+2 vs. compulsion and fear"',
  'Locate Creature':
    'Section=magic ' +
    'Note="Self senses direction of creature or kind in %1\' radius for %V min 1/dy"',
  'Locate Object':
    'Section=magic ' +
    'Note="Self senses direction of object or type in %1\' radius for %V min 1/dy"',
  'Mastery Of Counterspelling':
    'Section=magic Note="Counterspell turns effect back on caster"',
  'Mastery Of Elements':'Section=magic Note="Change energy type of spell"',
  'Mastery Of Energy':
    'Section=combat Note="+4 undead turning checks and damage"',
  'Mastery Of Shaping':'Section=magic Note="Create holes in spell effect area"',
  'Maximize Rune':
    'Section=magic Note="+5 DC Craft (rune) gives maximized effects"',
  'New Domain':'Section=feature Note="Choose additional deity domain"',
  'Oath Of Wrath':
    'Section=combat,save,skill ' +
    'Note="R60\' +2 attack and damage vs. chosen opponent until encounter ends 1/dy",' +
         '"R60\' +2 save vs. chosen opponent until encounter ends 1/dy",' +
         '"R60\' +2 checks vs. chosen opponent until encounter ends 1/dy"',
  'Obscure Object':
    'Section=magic ' +
    'Note="Touched gains immunity to divination for 8 hr 1/dy (DC %V Will neg)"',
  'Place Magic':
    'Section=magic Note="Cast spell w/out preparation when in Rashemen"',
  'Power Of Nature':
    'Section=feature Note="Transfer druid feature to another for 1-10 days"',
  'Rallying Cry':
    'Section=combat ' +
    'Note="R60\' Allies +1 next attack, +5\' Speed for 1 tn 3/dy"',
  'Red Wizard Bonus Feats':'Section=feature Note="%V Wizard feats"',
  'Reputation':'Section=feature Note="+%V Leadership"',
  'Rune Chant':'Section=magic Note="Trace rune for +3 DC divine spell"',
  'Rune Craft':'Section=skill Note="+%V Craft (rune)"',
  'Rune Power':'Section=magic Note="+%V DC of runes"',
  'Sacred Defense':'Section=save Note="+%V vs. divine spells and outsiders"',
  'Sanctuary':
    'Section=magic ' +
    'Note="Foes cannot attack self for %V rd or until self attacks 1/dy (DC %1 Will neg)"',
  'Scribe Tattoo':'Section=magic Note="Induct novices into circle"',
  'Shadow Adept Bonus Feats':'Section=feature Note="%V Metamagic feats"',
  'Shadow Defense':
    'Section=save ' +
    'Note="+%V vs. Enchantment, Illusion, Necromancy, and Darkness spells"',
  'Shadow Double':'Section=magic Note="Create clone lasting %V rd 1/dy"',
  'Shadow Feats':
    'Section=feature ' +
    'Note="Insidious Magic, Pernicious Magic, and Tenacious Magic"',
  'Shadow Walk':
    'Section=magic Note="Travel quickly via Plane of Shadow for %V hr"',
  'Shield Of Shadows':
    'Section=magic Note="<i>Shield</i> w/75% concealment %V rd/dy"',
  'Smite Infidel':
    'Section=combat ' +
    'Note="+%V attack, +%1 damage vs. foe w/different deity 1/dy"',
  'Specialist Defense':
    'Section=save Note="+%V bonus on saves vs. specialist school spells"',
  'Spell Power':'Section=magic Note="+%V spell DC and resistance checks"',
  'Spell-Like Ability':
    'Section=magic Note="Allows using spell as ability 2+/dy"',
  'Thwart Glyph':
    'Section=skill Note="+4 Disable Device (glyphs, runes, and symbols)/+4 Search (glyphs, runes, and symbols)"',
  'Transcendence':
    'Section=magic,skill ' +
    'Note="Chosen <i>Protection</i> spell at will",' +
         '"+2 charisma checks w/followers of %V"',
  "Tymora's Smile":
    'Section=save Note="+2 luck bonus to any save 1/dy"'

};
Realms.FEATURES = Object.assign({}, SRD35.FEATURES, Realms.FEATURES_ADDED);
Realms.GOODIES = Object.assign({}, SRD35.GOODIES);
Realms.LANGUAGES_ADDED = {
  'Aglarondan':'',
  'Alzhedo':'',
  'Chessentan':'',
  'Chondathan':'',
  'Chultan':'',
  'Damaran':'',
  'Durpari':'',
  'Halruaan':'',
  'Illuskan':'',
  'Lantanese':'',
  'Midani':'',
  'Mulhorandi':'',
  'Nexalan':'',
  'Rashemi':'',
  'Serusan':'',
  'Shaaran':'',
  'Shou':'',
  'Tashalan':'',
  'Tuigan':'',
  'Turmic':'',
  'Uluik':'',
  'Undercommon':'',
  'Untheric':''
};
Realms.PATHS_ADDED = {
  'Cavern Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Cavern Stonecunning"',
  'Charm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn On The Charm"',
  'Craft Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Creator"',
  'Darkness Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Blind-Fight"',
  'Drow Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Lightning Reflexes"',
  'Dwarf Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Great Fortitude"',
  'Elf Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Point-Blank Shot"',
  'Family Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Familial Protection"',
  'Fate Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Uncanny Dodge"',
  'Gnome Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Advanced Illusionist"',
  'Halfling Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Sprightly"',
  'Hatred Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Hated Foe"',
  'Illusion Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Advanced Illusionist"',
  'Mentalism Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Mental Ward"',
  'Metal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Hammer Specialist"',
  'Moon Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Lycanthropes"',
  'Nobility Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Inspire Allies"',
  'Ocean Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Water Breathing"',
  'Orc Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Smite Power"',
  'Planning Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Extend Spell"',
  'Portal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Detect Portal"',
  'Renewal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Renew Self"',
  'Retribution Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Strike Of Vengeance"',
  'Rune Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Scribe Scroll"',
  'Scalykind Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Reptiles"',
  'Slime Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Oozes"',
  'Spell Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Skilled Caster"',
  'Spider Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Spiders"',
  'Storm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Stormfriend"',
  'Suffering Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Pain Touch"',
  'Time Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Improved Initiative"',
  'Trade Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Trade Secrets"',
  'Tyranny Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Compelling Magic"',
  'Undeath Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Extra Turning"'
};
Realms.PATHS = Object.assign({}, SRD35.PATHS, Realms.PATHS_ADDED);
Realms.DEITIES = {
  'None':'Domain=' + QuilvynUtils.getKeys(Realms.PATHS).filter(x => x.match(/Domain$/)).map(x => x.replace(' Domain', '')).join(','),
  // Faerun
  'Akadi':
    'Alignment=N Weapon="Heavy Flail" Domain=Air,Illusion,Travel,Trickery',
  'Auril':'Alignment=NE Weapon=Battleaxe Domain=Air,Evil,Storm,Water',
  'Azuth':
    'Alignment=LN ' +
    'Weapon=Quarterstaff ' +
    'Domain=Illusion,Magic,Knowledge,Law,Spell',
  'Bane':
    'Alignment=LE ' +
    'Weapon=Morningstar ' +
    'Domain=Destruction,Evil,Hatred,Law,Tyranny',
  'Beshaba':'Alignment=CE Weapon=Scourge Domain=Chaos,Evil,Fate,Luck,Trickery',
  'Chauntea':
    'Alignment=NG ' +
    'Weapon=Scythe ' +
    'Domain=Animal,Earth,Good,Plant,Protection,Renewal',
  'Cyric':
    'Alignment=CE ' +
    'Weapon=Longsword ' +
    'Domain=Chaos,Destruction,Evil,Illusion,Trickery',
  'Deneir':'Alignment=NG Weapon=Dagger Domain=Good,Knowledge,Protection,Rune',
  'Eldath':'Alignment=NG Weapon=Net Domain=Family,Good,Plant,Protection,Water',
  'Finder Wyvernspur':
    'Alignment=CN Weapon="Bastard Sword" Domain=Chaos,Charm,Renewal,Scalykind',
  'Garagos':
    'Alignment=CN Weapon=Longsword Domain=Chaos,Destruction,Strength,War',
  'Gargauth':
    'Alignment=LE ' +
    'Weapon=Dagger ' +
    'Domain=Charm,Evil,Law,Trickery',
  'Gond':
    'Alignment=N ' +
    'Weapon=Warhammer ' +
    'Domain=Craft,Earth,Fire,Knowledge,Metal,Planning',
  'Grumbar':'Alignment=N Weapon=Warhammer Domain=Cavern,Earth,Metal,Time',
  'Gwaeron Windstrom':
    'Alignment=NG Weapon=Greatsword Domain=Animal,Good,Knowledge,Plant,Travel',
  'Helm':
    'Alignment=LN ' +
    'Weapon="Bastard Sword" ' +
    'Domain=Law,Planning,Protection,Strength',
  'Hoar':'Alignment=LN Weapon=Javelin Domain=Fate,Law,Retribution,Travel',
  'Ilmater':
    'Alignment=LG Weapon=Unarmed Domain=Good,Healing,Law,Strength,Suffering',
  'Istishia':
    'Alignment=N Weapon=Warhammer Domain=Destruction,Ocean,Storm,Travel,Water',
  'Jergal':'Alignment=LN Weapon=Scythe Domain=Death,Fate,Law,Rune,Suffering',
  'Kelemvor':
    'Alignment=LN ' +
    'Weapon="Bastard Sword" ' +
    'Domain=Death,Fate,Law,Protection,Travel',
  'Kossuth':
    'Alignment=N ' +
    'Weapon="Spiked Chain" ' +
    'Domain=Destruction,Fire,Renewal,Suffering',
  'Lathander':
    'Alignment=NG ' +
    'Weapon="Heavy Mace","Light Mace" ' +
    'Domain=Good,Nobility,Protection,Renewal,Strength,Sun',
  'Lliira':'Alignment=CG Weapon=Shuriken Domain=Chaos,Charm,Family,Good,Travel',
  'Loviatar':
    'Alignment=LE ' +
    'Weapon=Scourge ' +
    'Domain=Evil,Law,Retribution,Strength,Suffering',
  'Lurue':'Alignment=CG Weapon=Shortspear Domain=Animal,Chaos,Good,Healing',
  'Malar':
    'Alignment=CE Weapon="Claw Bracer" Domain=Animal,Chaos,Evil,Moon,Strength',
  'Mask':'Alignment=NE Weapon=Longsword Domain=Darkness,Evil,Luck,Trickery',
  'Mielikki':'Alignment=NG Weapon=Scimitar Domain=Animal,Good,Plant,Travel',
  'Milil':'Alignment=NG Weapon=Rapier Domain=Charm,Good,Knowledge,Nobility',
  'Mystra':
    'Alignment=NG ' +
    'Weapon=Shuriken ' +
    'Domain=Good,Illusion,Knowledge,Magic,Rune,Spell',
  'Nobanion':'Alignment=LG Weapon="Heavy Pick" Domain=Animal,Good,Law,Nobility',
  'Oghma':
    'Alignment=N Weapon=Longsword Domain=Charm,Knowledge,Luck,Travel,Trickery',
  'Red Knight':'Alignment=LN Weapon=Longsword Domain=Law,Nobility,Planning,War',
  'Savras':'Alignment=LN Weapon=Dagger Domain=Fate,Knowledge,Law,Magic,Spell',
  'Selune':
    'Alignment=CG Weapon="Heavy Mace" Domain=Chaos,Good,Moon,Protection,Travel',
  'Shar':'Alignment=NE Weapon=Chakram Domain=Cavern,Darkness,Evil,Knowledge',
  'Sharess':
    'Alignment=CG Weapon="Claw Bracer" Domain=Chaos,Charm,Good,Travel,Trickery',
  'Shaundakul':
    'Alignment=CN ' +
    'Weapon=Greatsword ' +
    'Domain=Air,Chaos,Portal,Protection,Trade,Travel',
  'Shiallia':
    'Alignment=NG Weapon=Quarterstaff Domain=Animal,Good,Plant,Renewal',
  'Siamorphe':
    'Alignment=LN Weapon="Light Mace" Domain=Knowledge,Law,Nobility,Planning',
  'Silvanus':
    'Alignment=N Weapon=Maul Domain=Animal,Plant,Protection,Renewal,Water',
  'Sune':'Alignment=CG Weapon=Whip Domain=Chaos,Charm,Good,Protection',
  'Talona':
    'Alignment=CE Weapon=Unarmed Domain=Chaos,Destruction,Evil,Suffering',
  'Talos':
    'Alignment=CE ' +
    'Weapon=Halfspear,Longspear,Shortspear ' +
    'Domain=Chaos,Destruction,Evil,Fire,Storm',
  'Tempus':'Alignment=CN Weapon=Battleaxe Domain=Chaos,Protection,Strength,War',
  'Tiamat':'Alignment=LE Weapon="Heavy Pick" Domain=Evil,Law,Scalykind,Tyranny',
  'Torm':
    'Alignment=LG ' +
    'Weapon=Greatsword ' +
    'Domain=Good,Healing,Law,Protection,Strength',
  'Tymora':
    'Alignment=CG Weapon=Shuriken Domain=Chaos,Good,Luck,Protection,Travel',
  'Tyr':
    'Alignment=LG Weapon=Longsword Domain=Good,Knowledge,Law,Retribution,War',
  'Ubtao':
    'Alignment=N ' +
    'Weapon="Heavy Pick" ' +
    'Domain=Planning,Plant,Protection,Scalykind',
  'Ulutiu':
    'Alignment=LN ' +
    'Weapon=Longspear,Shortspear ' +
    'Domain=Animal,Law,Ocean,Protection,Strength',
  'Umberlee':
    'Alignment=CE ' +
    'Weapon=Trident ' +
    'Domain=Chaos,Destruction,Evil,Ocean,Storm,Water',
  'Uthgar':
    'Alignment=CN ' +
    'Weapon=Battleaxe ' +
    'Domain=Animal,Chaos,Retribution,Strength,War',
  'Valkur':
    'Alignment=CG Weapon=Cutlass Domain=Air,Chaos,Good,Ocean,Protection',
  'Velsharoon':
    'Alignment=NE Weapon=Quarterstaff Domain=Death,Evil,Magic,Undeath',
  'Waukeen':
    'Alignment=N Weapon=Nunchaku Domain=Knowledge,Protection,Trade,Travel',

  // Mulhorandi
  'Anhur':'Alignment=CG Weapon=Falchion Domain=Chaos,Good,Strength,Storm,War',
  'Geb':'Alignment=N Weapon=Quarterstaff Domain=Cavern,Craft,Earth,Protection',
  'Hathor':'Alignment=NG Weapon="Short Sword" Domain=Family,Fate,Good,Moon',
  'Horus-Re':
    'Alignment=LG Weapon=Khopesh Domain=Good,Law,Nobility,Retribution,Sun',
  'Isis':
    'Alignment=NG ' +
    'Weapon="Punching Dagger" ' +
    'Domain=Family,Good,Magic,Storm,Water',
  'Nephthys':'Alignment=CG Weapon=Whip Domain=Chaos,Good,Protection,Trade',
  'Osiris':
    'Alignment=LG ' +
    'Weapon=Flail,"Heavy Flail" ' +
    'Domain=Death,Good,Law,Plant,Retribution',
  'Sebek':
    'Alignment=NE ' +
    'Weapon=Halfspear,Longspear,Shortspear ' +
    'Domain=Animal,Evil,Scalykind,Water',
  'Set':
    'Alignment=LE ' +
    'Weapon=Halfspear,Longspear,Shortspear ' +
    'Domain=Air,Darkness,Evil,Hatred,Law,Magic,Scalykind',
  'Thoth':
    'Alignment=N Weapon=Quarterstaff Domain=Craft,Knowledge,Magic,Rune,Spell',

  // Drow
  'Eilistraee':
    'Alignment=CG ' +
    'Weapon="Bastard Sword" ' +
    'Domain=Chaos,Charm,Drow,Elf,Good,Moon,Portal',
  'Ghaunadaur':
    'Alignment=CE Weapon=Warhammer Domain=Cavern,Chaos,Drow,Evil,Hatred,Slime',
  'Kiaransalee':
    'Alignment=CE Weapon=Dagger Domain=Chaos,Drow,Evil,Retribution,Undeath',
  'Lolth':
    'Alignment=CE ' +
    'Weapon=Dagger ' +
    'Domain=Chaos,Darkness,Destruction,Drow,Evil,Spider,Trickery',
  'Selvetarm':
    'Alignment=CE Weapon="Heavy Mace" Domain=Chaos,Drow,Evil,Spider,War',
  'Vhaeraun':
    'Alignment=CE Weapon="Short Sword" Domain=Chaos,Drow,Evil,Spider,War',

  // Dwarven
  'Abbathor':'Alignment=NE Weapon=Dagger Domain=Dwarf,Evil,Luck,Trade,Trickery',
  'Berronar Truesilver':
    'Alignment=LG ' +
    'Weapon="Heavy Mace" ' +
    'Domain=Dwarf,Family,Good,Healing,Law,Protection',
  'Clangeddin Silverbeard':
    'Alignment=LG Weapon=Battleaxe Domain=Dwarf,Good,Law,Strength,War',
  'Deep Duerra':
    'Alignment=LE Weapon=Battleaxe Domain=Dwarf,Evil,Law,Mentalism,War',
  'Dugmaren Brightmantle':
    'Alignment=CG ' +
    'Weapon="Short Sword" ' +
    'Domain=Chaos,Craft,Dwarf,Good,Knowledge,Rune',
  'Dumathoin':
    'Alignment=N ' +
    'Weapon=Maul ' +
    'Domain=Cavern,Craft,Dwarf,Earth,Knowledge,Metal,Protection',
  'Gorm Gulthyn':
    'Alignment=LG Weapon=Battleaxe Domain=Dwarf,Good,Law,Protection,War',
  'Haela Brightaxe':
    'Alignment=CG Weapon=Greatsword Domain=Chaos,Dwarf,Good,Luck,War',
  'Laduguer':
    'Alignment=LE ' +
    'Weapon=Warhammer ' +
    'Domain=Craft,Dwarf,Evil,Law,Magic,Metal,Protection',
  'Marthammor Duin':
    'Alignment=NG Weapon="Heavy Mace" Domain=Dwarf,Good,Protection,Travel',
  'Moradin':
    'Alignment=LG ' +
    'Weapon=Warhammer ' +
    'Domain=Craft,Dwarf,Earth,Good,Law,Protection',
  'Sharindlar':
    'Alignment=CG Weapon=Whip Domain=Chaos,Charm,Dwarf,Good,Healing,Moon',
  'Thard Harr':
    'Alignment=CG ' +
    'Weapon="Spiked Gauntlet" ' +
    'Domain=Animal,Chaos,Dwarf,Good,Plant',
  'Vergadain':'Alignment=N Weapon=Longsword Domain=Dwarf,Luck,Trade,Trickery',

  // Elven
  'Aerdrie Faenya':
    'Alignment=CG Weapon=Quarterstaff Domain=Air,Animal,Chaos,Elf,Good,Storm',
  'Angharradh':
    'Alignment=CG ' +
    'Weapon=Longspear,Shortspear ' +
    'Domain=Chaos,Elf,Good,Knowledge,Plant,Protection,Renewal',
  'Corellon Larethian':
    'Alignment=CG Weapon=Longsword Domain=Chaos,Elf,Good,Magic,Protection,War',
  'Deep Sashelas':
    'Alignment=CG Weapon=Trident Domain=Chaos,Elf,Good,Knowledge,Ocean,Water',
  'Erevan Ilesere':
    'Alignment=CN Weapon="Short Sword" Domain=Chaos,Elf,Luck,Trickery',
  'Fenmarel Mestarine':
    'Alignment=CN Weapon=Dagger Domain=Animal,Chaos,Elf,Plant,Travel',
  'Hanali Celanil':
    'Alignment=CG Weapon=Dagger Domain=Chaos,Charm,Elf,Good,Magic,Protection',
  'Labelas Enoreth':
    'Alignment=CG Weapon=Quarterstaff Domain=Chaos,Elf,Good,Knowledge,Time',
  'Rillifane Rallathil':
    'Alignment=CG Weapon=Quarterstaff Domain=Chaos,Elf,Good,Plant,Protection',
  'Sehanine Moonbow':
    'Alignment=CG ' +
    'Weapon=Quarterstaff ' +
    'Domain=Chaos,Elf,Good,Illusion,Knowledge,Moon,Travel',
  'Shevarash':'Alignment=CN Weapon=Longbow Domain=Chaos,Elf,Retribution,War',
  'Solonor Thelandira':
    'Alignment=CG Weapon=Longbow Domain=Chaos,Elf,Good,Plant,War',

  // Gnome
  'Baervan Wildwanderer':
    'Alignment=NG Weapon=Halfspear Domain=Animal,Gnome,Good,Plant,Travel',
  'Baravar Cloakshadow':
    'Alignment=NG Weapon=Dagger Domain=Gnome,Good,Illusion,Protection,Trickery',
  'Callarduran Smoothhands':
    'Alignment=N Weapon=Battleaxe Domain=Cavern,Craft,Earth,Gnome',
  'Flandal Steelskin':
    'Alignment=NG Weapon=Warhammer Domain=Craft,Gnome,Good,Metal',
  'Gaerdal Ironhand':
    'Alignment=LG Weapon=Warhammer Domain=Gnome,Good,Law,Protection,War',
  'Garl Glittergold':
    'Alignment=LG ' +
    'Weapon=Battleaxe ' +
    'Domain=Craft,Gnome,Good,Law,Protection,Trickery',
  'Segoyan Earthcaller':
    'Alignment=NG Weapon="Heavy Mace" Domain=Cavern,Earth,Gnome,Good',
  'Urdlen':
    'Alignment=CE Weapon="Claw Bracer" Domain=Chaos,Earth,Evil,Gnome,Hatred',

  // Halfling
  'Arvoreen':
    'Alignment=LG Weapon="Short Sword" Domain=Good,Halfling,Law,Protection,War',
  'Brandobaris':
    'Alignment=N Weapon=Dagger Domain=Halfling,Luck,Travel,Trickery',
  'Cyrrollalee':
    'Alignment=LG Weapon=Club,Quarterstaff Domain=Family,Good,Halfling,Law',
  'Sheela Peryoyl':'Alignment=N Weapon=Sickle Domain=Air,Charm,Halfling,Plant',
  'Urogalan':
    'Alignment=LN ' +
    'Weapon="Dire Flail",Flail,"Heavy Flail" ' +
    'Domain=Death,Earth,Halfling,Law,Protection',
  'Yondalla':
    'Alignment=LG ' +
    'Weapon="Short Sword" ' +
    'Domain=Family,Good,Halfling,Law,Protection',

  // Orc
  'Bahgtru':
    'Alignment=CE Weapon="Spiked Gauntlet" Domain=Chaos,Evil,Orc,Strength',
  'Gruumsh':
    'Alignment=CE ' +
    'Weapon=Longspear,Shortspear ' +
    'Domain=Cavern,Chaos,Evil,Hatred,Orc,Strength,War',
  'Ilneval':
    'Alignment=NE Weapon=Longsword Domain=Destruction,Evil,Orc,Planning,War',
  'Luthic':
    'Alignment=NE ' +
    'Weapon="Claw Bracer" ' +
    'Domain=Cavern,Earth,Evil,Family,Healing,Orc',
  'Shargaas':
    'Alignment=CE Weapon="Short Sword" Domain=Chaos,Darkness,Evil,Orc,Trickery',
  'Yurtrus':
    'Alignment=NE Weapon=Unarmed Domain=Death,Destruction,Evil,Orc,Suffering'

};
Realms.RACES = {
  'Gold Dwarf':
    SRD35.RACES['Dwarf']
      .replace('Dwarf Ability', 'Gold Dwarf Ability')
      .replace('Dwarf Enmity', 'Gold Dwarf Enmity'),
  'Gray Dwarf':
    SRD35.RACES['Dwarf']
      .replace('Common', 'Undercommon')
      .replace('Dwarf Ability Adjustment', 'Gray Dwarf Ability Adjustment')
      .replace(/['"]?Darkvision['"]?/, '"Extended Darkvision"')
      .replace('Features=', 'Features="Duergar Alertness","Gray Dwarf Immunities","Light Sensitivity","Race Level Adjustment","Stealthy Movement",') + ' ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Duergaren1:1=1,' +
      'Duergaren2:1=1',
  'Shield Dwarf':
    SRD35.RACES['Dwarf'],
  'Drow Elf':
    SRD35.RACES['Elf']
      .replace('Common', 'Undercommon')
      .replace('Elf Ability Adjustment', 'Drow Elf Ability Adjustment')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace(/Weapon Proficiency[^'"]*/, 'Weapon Proficiency (Hand Crossbow/Light Crossbow/Rapier/Shortsword)')
      .replace('Features=', 'Features="Drow Elf Spell Resistance","Light Blindness","Light Sensitivity","Race Level Adjustment","Strong Will",') + ' ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      '"Drowen0:1=1",' +
      '"Drowen1:1=1",' +
      '"Drowen2:1=1"',
  'Moon Elf':
    SRD35.RACES['Elf'],
  'Sun Elf':
    SRD35.RACES['Elf'].replace('Elf Ability', 'Sun Elf Ability'),
  'Wild Elf':
    SRD35.RACES['Elf'].replace('Elf Ability', 'Wild Elf Ability'),
  'Wood Elf':
    SRD35.RACES['Elf'].replace('Elf Ability', 'Wood Elf Ability'),
  'Deep Gnome':
    SRD35.RACES['Gnome']
      .replace('Common', 'Undercommon')
      .replace('Gnome Ability Adjustment', 'Deep Gnome Ability Adjustment')
      .replace('Dodge Giants', 'Exceptional Dodge')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace('Features=', 'Features="Extra Luck","Know Depth","Race Level Adjustment",Shadowed,Stonecunning,"Svirfneblin Spell Resistance",Undetectable,') + ' ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Svirfneblinish1:1=1,' +
      'Svirfneblinish2:1=2,' +
      'Svirfneblinish3:1=1',
  'Rock Gnome':
    SRD35.RACES['Gnome'],
  'Half-Elf':
    SRD35.RACES['Half-Elf'],
  'Half-Orc':
    SRD35.RACES['Half-Orc'],
  'Ghostwise Halfling':
    SRD35.RACES['Halfling']
      .replace('Fortunate', '"Speak Without Sound"'),
  'Lightfoot Halfling':
    SRD35.RACES['Halfling'],
  'Strongheart Halfling':
    SRD35.RACES['Halfling']
      .replace('Fortunate', '"Strongheart Extra Feat"'),
  'Human':
    SRD35.RACES['Human'],
  'Aasimar':
    'Features=' +
      '"1:Aasimar Ability Adjustment","1:Aasimar Alertness",' +
      '"1:Aasimar Resistance",1:Darkvision,"1:Native Outsider",' +
      '"1:Race Level Adjustment" ' +
    'Languages=Common ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Aasimaren0:1=1',
  'Air Genasi':
    'Features=' +
      '"1:Air Genasi Ability Adjustment",1:Breathless,1:Darkvision,' +
      '"1:Elemental Affinity","1:Native Outsider","1:Race Level Adjustment" ' +
    'Languages=Common ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Airen2:1=1',
  'Earth Genasi':
    'Features=' +
      '1:Darkvision,"1:Earth Genasi Ability Adjustment",' +
      '"1:Elemental Affinity","1:Native Outsider","1:Race Level Adjustment" ' +
    'Languages=Common ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Earthen1:1=1',
  'Fire Genasi':
    'Features=' +
      '"1:Control Flame",1:Darkvision,"1:Elemental Affinity",' +
      '"1:Fire Genasi Ability Adjustment","1:Native Outsider",' +
      '"1:Race Level Adjustment" ' +
    'Languages=Common',
  'Water Genasi':
    'Features=' +
      '1:Amphibious,1:Darkvision,"1:Elemental Affinity",' +
      '"1:Native Outsider","1:Natural Swimmer","1:Race Level Adjustment",' +
      '"1:Water Genasi Ability Adjustment" ' +
    'Languages=Common ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Wateren0:1=1',
  'Tiefling':
    'Features=' +
      '1:Darkvision,"1:Native Outsider",' +
      '"1:Race Level Adjustment",1:Sneaky,"1:Tiefling Ability Adjustment",' +
      '"1:Tiefling Resistance" ' +
    'Languages=Common ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Tieflen2:1=1'
};
Realms.REGIONS = {
  'Aglarond':'',
  'Amn':'',
  'Anauroch':'',
  'Calimshan':'',
  'Chessenta':'',
  'Chondalwood':'',
  'Chult':'',
  'Cormyr':'',
  'Dalelands':'',
  'Damara':'',
  'Deep Gnome':'',
  'Dragon Coast':'',
  'Drow Elf':'',
  'Evermeet':'',
  'Ghostwise Halfling':'',
  'Gold Dwarf':'',
  'Gray Dwarf':'',
  'Great Dale':'',
  'Half-Elf':'',
  'Half-Orc':'',
  'Halruaa':'',
  'High Forest':'',
  'Hordelands':'',
  'Human':'',
  'Impiltur':'',
  'Lake Of Steam':'',
  'Lantan':'',
  'Lightfoot Halfling':'',
  'Luiren':'',
  'Moon Elf':'',
  'Moonsea':'',
  'Moonshae Isles':'',
  'Mulhorand':'',
  'Narfell':'',
  'Nelanther Isles':'',
  'Orc':'',
  'Rashemen':'',
  'Rock Gnome':'',
  'Sembia':'',
  'Shield Dwarf':'',
  'Silverymoon':'',
  'Strongheart Halfling':'',
  'Sun Elf':'',
  'Tashalar':'',
  'Tehtyr':'',
  'Thay':'',
  'The North':'',
  'The Shaar':'',
  'The Vast':'',
  'Thesk':'',
  'Unther':'',
  'Vaasa':'',
  'Vilhon Reach':'',
  'Waterdeep':'',
  'Western Heartlands':'',
  'Wild Elf':'',
  'Wood Elf':''
};
Realms.SCHOOLS = Object.assign({}, SRD35.SCHOOLS);
Realms.SHIELDS = Object.assign({}, SRD35.SHIELDS);
Realms.SKILLS = Object.assign({}, SRD35.SKILLS);
Realms.SPELLS_ADDED = {

  "Aganazzar's Scorcher":
    'School=Evocation ' +
    'Level=W2 ' +
    'Description="Creatures in 5\' by $RS\' path suffer ${Ldiv2min5}d8 HP (Ref half)"',
  'Analyze Portal':
    'School=Divination ' +
    'Level=B3,Portal2,W3 ' +
    'Description="R60\' QUarter circle gives self info on portals for $L rd or conc"',
  'Anyspell':
    'School=Transmutation ' +
    'Level=Spell3 ' +
    'Description="Prepares up to 2nd level arcane spell from written source"',
  'Armor Of Darkness':
    'School=Abjuration ' +
    'Level=Darkness4 ' +
    'Description="Touched gains +$Ldiv4plus3min8 AC and 60\' darkvision for $L10 min"',
  'Blacklight':
    'School=Evocation ' +
    'Level=Darkness3,W3 ' +
    'Description="R$RS\' 20\' radius enveloped in darkness only self can see within for $L rd (Will neg)"',
  'Claws Of Darkness':
    'School=Illusion ' +
   'Level=W2 ' +
    'Description="Self hands become 6\' extendable claws inflicting 1d4 HP and slowing via grapple (Fort neg) for $L rd"',
  'Cloak Of Dark Power':
    'School=Abjuration ' +
    'Level=Drow1 ' +
    'Description="Touched protected from sunlight, +4 save vs. light and darkness effects for $L min"',
  'Create Magic Tattoo':
    'School=Conjuration ' +
    'Level=W2 ' +
    'Description="Touched gains magic tattoo w/specified effects for 1 dy"',
  'Darkbolt':
    'School=Evocation ' +
    'Level=Darkness5 ' +
    'Description="R$RM\' Ranged touch with ${lvl//2<?7} bolts in 30\' radius inflict 2d8 HP each and daze 1 rd (Will neg)"',
  "Elminster's Evasion":
    'School=Evocation ' +
    'Level=W9 ' +
    'Description="Self and up to 50 lb teleport to named locale"',
  'Fantastic Machine':
    'School=Illusion ' +
    'Level=Craft6,Gnome6 ' +
    'Description="Large illusory machine (HP 22, AC 14, slam +5 1d8+4, throw rocks +3 2d6+4, move 40\'/rd, swim and fly 10\'/rd, load 230) obeys self for $L min"',
  'Fire Stride':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="Self teleports $RL\' between fires $L times for $L10 min"',
  'Flashburst':
    'School=Evocation ' +
    'Level=W3 ' +
    'Description="R$RL\' Creatures in 20\' radius dazzled (-1 attack) for 1 rd, those w/in 120\' blinded (Will neg) for 2d8 rd"',
  'Flensing':
    'School=Evocation ' +
    'Level=W8 ' +
    'Description="R$RS\' Target suffers 2d6 HP and -1d6 Charisma and Constitution (Fort half HP only) for 4 rd"',
  'Gate Seal':
    'School=Abjuration ' +
    'Level=B6,C6,D6,W6 ' +
    'Description="R$RS\' Seals magical gate or portal"',
  'Gembomb':
    'School=Conjuration ' +
    'Level=Gnome2,Trade2 ' +
    'Description="Up to 5 gems become R100\' ranged touch bombs inflicting ${Ldiv2min5}d8 HP total (Ref half)"',
  'Great Shout':
    'School=Evocation ' +
    'Level=B6,W8 ' +
    'Description="R$RS\' Objects in range suffer 20d6 HP (Ref neg), creatures in cone suffer 10d6 HP, stunned for 1 rd, and deafened for 4d6 rd (Fort half)"',
  'Greater Anyspell':
    'School=Transmutation ' +
    'Level=Spell6 ' +
    'Description="Prepares up to 5th level arcane spell from written source"',
  'Greater Fantastic Machine':
    'School=Illusion ' +
    'Level=Craft9 ' +
    'Description="Large illusory machine (HP 88, AC 20, slam +17,+12 1d8+9, throw rocks +12,+7 2d6+9, move 60\'/rd, swim and fly 20\'/rd, load 520) obeys self for $L min"',
  "Grimwald's Graymantle":
    'School=Necromancy ' +
    'Level=W5 ' +
    'Description="R$RM\' Touched prevented from healing, restoring, and regenerating for $L rd (Fort neg)"',
  'Lesser Ironguard':
    'School=Abjuration ' +
    'Level=W5 ' +
    'Description="Touched gains immunity to normal metal for $L rd"',
  'Maelstrom':
    'School=Conjuration ' +
    'Level=Ocean8 ' +
    'Description="R$RL\' Creatures in whirlpool suffer 3d8 HP for 2d4 rd (Ref et al neg) for $L rd"',
  'Maw Of Stone':
    'School=Transmutation ' +
    'Level=Cavern7 ' +
    'Description="Animates natural opening to perform +%{levels.Cleric+wisdomModifier+7} grapple that inflicts 2d6+10 HP"',
  'Moon Blade':
    'School=Evocation ' +
    'Level=Moon3,W3 ' + // W3 for Hathran
    'Description="Moonlight blade touch attack inflicts 1d8+$Ldiv2 HP (undead 2d8+$L HP) for $L min"',
  'Moon Path':
    'School=Evocation ' +
    'Level=Moon5,W5 ' + // W5 for Hathran
    'Description="Creates glowing pathway 5\'-20\' by $L15\' for $L min that provides <i>Sanctuary</i> for $L designed creatures"',
  'Moonbeam':
    'School=Evocation ' +
    'Level=Moon2,W2 ' + // W2 for Hathran
    'Description="R$RS\' Target lycanthropes assume animal form for $L min (Will neg)"',
  'Moonfire':
    'School=Evocation ' +
    'Level=Moon9 ' +
    'Description="R$RS\' Cone inflicts ${Ldiv2min10}d8 HP (undead dbl) (Ref half), reverts changed creatures to normal form (Will neg), and marks auras for $L min"',
  'Scatterspray':
    'School=Transmutation ' +
    'Level=Harper1,W1 ' +
    'Description="R$RS\' Little items in 1\' radius scatter, inflicting 1d8 on creatures w/in 10\' (Ref neg)"',
  'Shadow Mask':
    'School=Illusion ' +
    'Level=Harper2,W2 ' +
    'Description="Hides self\'s face, gives +4 saves vs. light and dark and 50% protection from gaze attacks for $L10 min"',
  'Shadow Spray':
    'School=Illusion ' +
    'Level=W2 ' +
    'Description="R$RM\' Creatures in 5\' radius suffer -2 Strength and fear saves and dazed 1 rd for $L rd (Fort neg)"',
  "Snilloc's Snowball Swarm":
    'School=Evocation ' +
    'Level=W2 ' +
    'Description="R$RM\' Creatures in 10\' radius suffer ${Lplus1div2min5}d6 HP (Ref half)"',
  'Spider Curse':
    'School=Transmutation ' +
    'Level=Spider6 ' +
    'Description="R$RM\' Target polymorphs into drider and obeys self thoughts for $L dy (Will neg)"',
  'Spider Shapes':
    'School=Transmutation ' +
    'Level=Spider9 ' +
    'Description="R$RS\' Willing target polymorphs into monstrous spider for $L hr"',
  'Spiderform':
    'School=Transmutation ' +
    'Level=Drow5 ' +
    'Description="Self polymorphs into drider or monstrous spider for $L hr"',
  'Stone Spiders':
    'School=Transmutation ' +
    'Level=Spider7 ' +
    'Description="R$RS\' Transforms 1d3 pebbles into monstrous spiders that obey self for $L rd"',
  'Thunderlance':
    'School=Evocation ' +
    'Level=W4 ' +
    'Description="Self wields shimmering staff (+$Ldiv2plus1 attack, 2d6+$Ldiv2plus1 x3@20) 1\' - 20\' long for $L rd"',
  'Waterspout':
    'School=Conjuration ' +
    'Level=Ocean7 ' +
    'Description="R$RL\' Self moves 10\'x80\' spout 30\'/rd; touched creatures suffer 2d6 HP (Ref neg) for $L rd"'
};
Realms.SPELLS = Object.assign(
  {}, window.PHB35 != null ? PHB35.SPELLS : SRD35.SPELLS, Realms.SPELLS_ADDED
);
Realms.SPELLS_LEVELS = {
  'Acid Arrow':'Slime2',
  'Alter Self':'Harper1',
  'Animal Growth':'Scalykind5',
  'Animal Shapes':'Moon8,Scalykind8',
  'Animal Trance':'Scalykind2',
  'Animate Dead':'Undeath3',
  'Animate Rope':'Craft1',
  'Antimagic Field':'Spell8',
  'Antipathy':'Elf9,Hatred8,Mentalism7',
  'Astral Projection':'Mentalism9',
  'Atonement':'Renewal5',
  'Augury':'Fate2,Planning2',
  'Bane':'Suffering1',
  'Banishment':'Portal6,Retribution6',
  // 3.0 Endurance => 3.5 Bear's Endurance
  "Bear's Endurance":'Dwarf2,Retribution2,Suffering2',
  'Bestow Curse':'Fate3,Hatred3,Suffering3',
  'Black Tentacles':'Slime5',
  'Blade Barrier':'Metal6',
  'Blasphemy':'Hatred7,Orc7',
  'Bless':'Family1',
  'Blindness/Deafness':'Darkness2,Svirfneblinish2',
  'Blur':'Svirfneblinish2',
  'Break Enchantment':'Spell5',
  'Call Lightning':'Storm3',
  'Calm Emotions':'Charm2',
  "Cat's Grace":'Elf2,Halfling2,Harper2',
  'Cause Fear':'Orc1',
  'Charm Monster':'Charm5',
  'Charm Person':'Charm1,Harper1,Renewal1',
  'Clairaudience/Clairvoyance':'Drow2,Harper3,Mentalism3,Planning3',
  'Cloak Of Chaos':'Orc8',
  'Command':'Tyranny1',
  'Commune With Nature':'Elf5',
  'Comprehend Languages':'Harper1',
  'Contingency':'Time6',
  'Control Undead':'Undeath7',
  'Control Weather':'Storm7',
  'Create Greater Undead':'Undeath8',
  'Create Undead':'Undeath6',
  'Create Water':'Wateren0',
  'Creeping Doom':'Scalykind7,Spider8',
  'Dancing Lights':'Drowen0',
  'Darkness':'Cavern2,Drowen2,Tieflen2',
  'Darkvision':'Harper2',
  'Death Ward':'Undeath4',
  'Deathwatch':'Planning1',
  'Demand':'Charm8,Nobility8',
  'Desecrate':'Undeath2',
  'Destruction':'Slime7',
  'Detect Scrying':'Planning5',
  'Detect Secret Doors':'Cavern1',
  'Detect Thoughts':'Harper2,Mentalism2,Trade1',
  'Detect Undead':'Undeath1',
  'Dictum':'Dwarf7',
  'Dimension Door':'Portal4',
  'Dimensional Anchor':'Portal3',
  'Discern Lies':'Drow4,Nobility4,Tyranny3',
  'Discern Location':'Planning8,Retribution8,Trade9',
  'Disguise Self':'Svirfneblinish1',
  'Displacement':'Illusion3',
  'Divine Favor':'Nobility1',
  'Divine Power':'Orc4',
  'Dominate Monster':'Charm9,Tyranny9',
  'Doom':'Hatred1',
  "Eagle's Splendor":'Harper2,Trade3',
  'Earthquake':'Cavern8',
  'Elemental Swarm':'Dwarf9,Ocean9',
  'Endure Elements':'Ocean1',
  'Energy Drain':'Undeath9',
  'Enervation':'Suffering4',
  // 3.0 Enlarge => 3.5 Enlarge Person
  'Enlarge Person':'Duergaren1',
  'Enthrall':'Nobility2,Tyranny2',
  'Entropic Shield':'Storm1',
  'Erase':'Harper1,Rune1',
  'Etherealness':'Portal7',
  'Explosive Runes':'Rune4',
  'Eyebite':'Orc6,Scalykind6,Suffering7',
  'Fabricate':'Dwarf5,Trade5',
  'Faerie Fire':'Drowen1,Moon1',
  'Fear':'Tyranny4',
  'Feather Fall':'Harper1',
  'Feeblemind':'Suffering5',
  'Find The Path':'Cavern6,Elf6',
  'Fire Shield':'Retribution4',
  'Forbiddance':'Hatred6',
  'Forcecage':'Craft8',
  'Foresight':'Fate9,Halfling9,Time8',
  'Freedom':'Renewal9',
  'Freedom Of Movement':'Halfling4,Ocean4,Time4',
  "Freezing Sphere":'Ocean6',
  'Gate':'Drow9,Portal9',
  'Geas/Quest':'Charm6,Fate6,Nobility6,Tyranny6',
  'Gentle Repose':'Time2',
  'Giant Vermin':'Spider4',
  'Glyph Of Warding':'Dwarf3,Rune3',
  // 3.0 Emotion => 3.5 Good Hope
  'Good Hope':'Charm4,Moon4',
  'Grasping Hand':'Tyranny7',
  'Grease':'Slime1',
  'Greater Command':'Nobility5,Tyranny5',
  'Greater Dispel Magic':'Drow6',
  'Greater Glyph Of Warding':'Rune6',
  'Greater Magic Fang':'Scalykind3',
  'Greater Magic Weapon':'Dwarf4',
  'Greater Planar Ally':'Drow8',
  'Greater Restoration':'Renewal7',
  'Greater Scrying':'Planning7',
  'Gust Of Wind':'Storm2',
  'Hallucinatory Terrain':'Gnome5',
  'Harm':'Suffering6',
  'Haste':'Time3',
  'Heat Metal':'Metal2',
  'Helping Hand':'Family3',
  "Heroes' Feast":'Family6,Planning6,Renewal6',
  'Horrid Wilting':'Suffering9',
  'Ice Storm':'Storm5',
  'Imbue With Spell Ability':'Family4',
  'Implosion':'Slime9',
  'Imprisonment':'Cavern9',
  'Insanity':'Charm7,Moon7',
  'Insect Plague':'Spider5',
  'Instant Summons':'Rune7',
  'Invisibility':'Duergaren2,Harper2',
  'Iron Body':'Metal8',
  "Irresistible Dance":'Gnome8',
  'Jump':'Harper1',
  'Keen Edge':'Metal3',
  'Knock':'Harper2',
  // 3.0 Random Action => 3.5 Lesser Confusion
  'Lesser Confusion':'Mentalism1',
  'Lesser Planar Binding':'Rune5',
  'Lesser Restoration':'Renewal2',
  'Levitate':'Airen2',
  'Light':'Aasimaren0,Harper1',
  'Limited Wish':'Spell7',
  'Liveoak':'Elf7',
  'Locate Object':'Harper2',
  'Mage Armor':'Spell1',
  "Mage's Disjunction":'Spell9',
  "Mage's Faithful Hound":'Halfling5',
  "Mage's Magnificent Mansion":'Trade7',
  'Magic Fang':'Scalykind1',
  'Magic Mouth':'Harper2',
  'Magic Stone':'Halfling1',
  'Magic Vestment':'Halfling3,Nobility3',
  'Magic Weapon':'Dwarf1,Metal1',
  'Major Creation':'Craft7',
  'Mark Of Justice':'Fate5,Retribution5',
  'Mass Charm Monster':'Tyranny8',
  // 3.0 Circle Of Doom => 3.5 Mass Inflict Light Wounds
  'Mass Inflict Light Wounds':'Undeath5',
  'Maze':'Portal8',
  'Meld Into Stone':'Cavern3',
  'Message':'Harper1,Trade1',
  'Mind Blank':'Fate8,Mentalism8,Trade8',
  'Mind Fog':'Mentalism5',
  'Minor Creation':'Craft4,Gnome4',
  'Minor Image':'Gnome3,Illusion2',
  'Misdirection':'Harper2',
  'Mislead':'Illusion6',
  'Mnemonic Enhancer':'Spell4',
  'Modify Memory':'Mentalism4',
  // 3.0 Mass Haste => 3.5 Moment Of Prescience
  'Moment Of Prescience':'Time7',
  'Mount':'Harper1',
  'Move Earth':'Halfling6',
  'Nightmare':'Darkness7',
  'Nondetection':'Harper3,Svirfneblinish3',
  'Obscuring Mist':'Darkness1',
  'Pass Without Trace':'Earthen1',
  'Passwall':'Cavern5',
  'Permanency':'Time5',
  'Permanent Image':'Moon6',
  'Persistent Image':'Illusion5',
  'Phantasmal Killer':'Illusion4',
  'Phantom Steed':'Spider3',
  'Poison':'Scalykind4,Slime3',
  'Polymorph Any Object':'Renewal8',
  'Power Word Blind':'Darkness8,Slime8',
  'Power Word Kill':'Darkness9,Orc9',
  'Prayer':'Orc3',
  'Prismatic Sphere':'Family9',
  'Produce Flame':'Orc2',
  'Project Image':'Illusion7',
  'Protection From Spells':'Dwarf8,Family8',
  'Prying Eyes':'Darkness6,Orc5',
  'Read Magic':'Harper1',
  'Refuge':'Family7',
  'Reincarnate':'Renewal4',
  'Remove Disease':'Renewal3',
  'Repel Metal Or Stone':'Metal9',
  'Repulsion':'Nobility7',
  'Righteous Might':'Hatred5',
  'Rusting Grasp':'Metal4,Slime4',
  'Scare':'Hatred2',
  'Screen':'Gnome7,Illusion8',
  'Secret Page':'Rune2',
  'Secure Shelter':'Cavern4',
  'See Invisibility':'Harper2',
  'Sending':'Trade4',
  'Shadow Walk':'Halfling7',
  'Shapechange':'Scalykind9',
  'Shield Of Faith':'Retribution1',
  'Shield Other':'Family2',
  'Silence':'Spell2',
  'Silent Image':'Gnome1,Illusion1',
  'Sleet Storm':'Storm4',
  'Sleep':'Harper1',
  'Snare':'Elf3',
  // 3.0 Emotion => 3.5 Song Of Discord
  'Song Of Discord':'Hatred4',
  'Sound Burst':'Ocean2',
  'Speak With Dead':'Retribution3',
  'Spell Turning':'Retribution7',
  'Spider Climb':'Harper1,Spider1',
  'Status':'Fate4,Planning4',
  'Stone Shape':'Craft3',
  'Stone Tell':'Dwarf6',
  'Storm Of Vengeance':'Nobility9,Retribution9,Storm9',
  'Suggestion':'Charm3,Drow3,Harper3',
  'Summon Monster I':'Portal1',
  'Summon Monster VI':'Storm6',
  "Summon Nature's Ally IX":'Gnome9',
  'Summon Swarm':'Spider2',
  'Sunburst':'Elf8',
  'Symbol Of Death':'Rune8',
  'Symbol Of Pain':'Suffering8',
  'Telepathic Bond':'Family5,Mentalism6',
  'Teleport':'Portal5',
  'Teleportation Circle':'Rune9',
  'Time Stop':'Planning9,Time9',
  'Tongues':'Harper3',
  'Transmute Metal To Wood':'Metal7',
  'Transmute Rock To Mud':'Slime6',
  'Tree Stride':'Elf4',
  'True Seeing':'Trade6',
  'True Strike':'Elf1,Fate1,Time1',
  'Undetectable Alignment':'Harper3',
  'Vision':'Fate7',
  'Wail Of The Banshee':'Hatred9',
  'Wall Of Ice':'Ocean5',
  'Wall Of Iron':'Metal5',
  'Wall Of Stone':'Craft5',
  'Water Breathing':'Ocean3',
  'Weird':'Illusion9',
  'Whirlwind':'Storm8',
  'Wood Shape':'Craft2',
  'Word Of Chaos':'Drow7',
  'Word Of Recall':'Halfling8'
};
for(var s in Realms.SPELLS_LEVELS) {
  var levels = Realms.SPELLS_LEVELS[s];
  if(!(s in Realms.SPELLS)) {
    if(window.PHB35 && PHB35.SPELL_RENAMES && s in PHB35.SPELL_RENAMES) {
      s = PHB35.SPELL_RENAMES[s];
    } else {
      // We might be loading before PHB35 has completed. There will be another
      // chance to pick this up during Realms() initialization.
      // console.log('Missing spell "' + s + '"');
      continue;
    }
  }
  Realms.SPELLS[s] =
    Realms.SPELLS[s].replace('Level=', 'Level=' + levels + ',');
}
Realms.WEAPONS_ADDED = {
  'Blade Boot':'Level=3 Category=Li Damage=1d4 Threat=19',
  'Chakram':'Level=3 Category=R Damage=1d4 Crit=3 Range=30',
  'Claw Bracer':'Level=3 Category=1h Damage=1d4 Threat=19',
  'Cutlass':'Level=2 Category=1h Damage=1d6 Threat=19',
  'Halfspear':'Level=1 Category=R Damage=d6 Crit=3 Range=20',
  'Khopesh':'Level=3 Category=1h Damage=1d8 Threat=19',
  'Saber':'Level=2 Category=1h Damage=1d8 Threat=19',
  'Maul':'Level=2 Category=2h Damage=1d10 Crit=3 Threat=20',
  'Scourge':'Level=3 Category=1h Damage=1d8 Threat=20'
};
Realms.WEAPONS = Object.assign({}, SRD35.WEAPONS, Realms.WEAPONS_ADDED);

/* Defines the rules related to character abilities. */
Realms.abilityRules = function(rules) {
  rules.basePlugin.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
Realms.aideRules = function(rules, companions, familiars) {
  rules.basePlugin.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to combat. */
Realms.combatRules = function(rules, armors, shields, weapons) {
  rules.basePlugin.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
Realms.identityRules = function(
  rules, alignments, classes, deities, paths, races, regions, prestigeClasses,
  npcClasses
) {

  QuilvynUtils.checkAttrTable(regions, []);

  if(rules.basePlugin == window.Pathfinder)
    Pathfinder.identityRules(
      rules, alignments, classes, deities, {}, paths, races, Pathfinder.TRACKS,
      Pathfinder.TRAITS, prestigeClasses, npcClasses
    );
  else
    SRD35.identityRules(
      rules, alignments, classes, deities, paths, races, prestigeClasses,
      npcClasses
    );

  for(var region in regions) {
    rules.choiceRules(rules, 'Region', region, regions[region]);
  }

  // Level adjustments for powerful races
  rules.defineRule('abilityNotes.raceLevelAdjustment',
    'race', '=', 'source.match(/Aasimar|Genasi|Tiefling/) ? 1 : source.match(/Drow|Gray Dwarf/) ? 2 : source == "Deep Gnome" ? 3 : null'
  );
  rules.defineRule('level', '', '^', '1');
  rules.defineRule('experienceNeededLevel',
    'level', '=', null,
    'abilityNotes.raceLevelAdjustment', '+', null
  );
  if(rules.basePlugin == window.Pathfinder) {
    for(var track in Pathfinder.TRACKS) {
      var progression =
        QuilvynUtils.getAttrValueArray(Pathfinder.TRACKS[track], 'Progression');
      rules.defineRule(track + 'Needed',
        'experienceNeededLevel', '=', 'source < ' + progression.length + ' ? [' + progression + '][source] * 1000 : ' + (progression[progression.length - 1] * 1000 + 1)
      );
    }
  } else {
    rules.defineRule('experienceNeeded',
      'experienceNeededLevel', '=', '1000 * source * (source + 1) / 2'
    );
  }
  // Add region to editor and character sheet
  rules.defineChoice('notes',
    'validationNotes.regionRace:Racial region requires equivalent race'
  );
  rules.defineRule('validationNotes.regionRace',
    'region', '=', 'Realms.RACES[source] ? QuilvynUtils.findElement(QuilvynUtils.getKeys(Realms.RACES), source) : null',
    'race', '+', '-QuilvynUtils.findElement(QuilvynUtils.getKeys(Realms.RACES), source)'
  );
  rules.defineEditorElement
    ('region', 'Region', 'select-one', 'regions', 'alignment');
  rules.defineSheetElement('Region', 'Alignment');

};

/* Defines rules related to magic use. */
Realms.magicRules = function(rules, schools, spells) {
  rules.basePlugin.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
Realms.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  rules.basePlugin.talentRules
    (rules, feats, features, goodies, languages, skills);
  // No changes needed to the rules defined by base method
};

/*
 * Adds #name# as a possible user #type# choice and parses #attrs# to add rules
 * related to selecting that choice.
 */
Realms.choiceRules = function(rules, type, name, attrs) {
  if(type == 'Alignment')
    Realms.alignmentRules(rules, name);
  else if(type == 'Animal Companion')
    Realms.companionRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Armor')
    Realms.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Class' || type == 'Npc' || type == 'Prestige') {
    Realms.classRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'HitDie'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValue(attrs, 'SkillPoints'),
      QuilvynUtils.getAttrValue(attrs, 'Fortitude'),
      QuilvynUtils.getAttrValue(attrs, 'Reflex'),
      QuilvynUtils.getAttrValue(attrs, 'Will'),
      QuilvynUtils.getAttrValueArray(attrs, 'Skills'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelArcane'),
      QuilvynUtils.getAttrValue(attrs, 'CasterLevelDivine'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Realms.classRulesExtra(rules, name);
  } else if(type == 'Deity')
    Realms.deityRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Alignment'),
      QuilvynUtils.getAttrValueArray(attrs, 'Domain'),
      QuilvynUtils.getAttrValueArray(attrs, 'Weapon')
    );
  else if(type == 'Familiar')
    Realms.familiarRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Str'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Con'),
      QuilvynUtils.getAttrValue(attrs, 'Int'),
      QuilvynUtils.getAttrValue(attrs, 'Wis'),
      QuilvynUtils.getAttrValue(attrs, 'Cha'),
      QuilvynUtils.getAttrValue(attrs, 'HD'),
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Attack'),
      QuilvynUtils.getAttrValueArray(attrs, 'Dam'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Level')
    );
  else if(type == 'Feat') {
    Realms.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    Realms.featRulesExtra(rules, name);
  } else if(type == 'Feature')
     Realms.featureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Goody')
    Realms.goodyRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Pattern'),
      QuilvynUtils.getAttrValue(attrs, 'Effect'),
      QuilvynUtils.getAttrValue(attrs, 'Value'),
      QuilvynUtils.getAttrValueArray(attrs, 'Attribute'),
      QuilvynUtils.getAttrValueArray(attrs, 'Section'),
      QuilvynUtils.getAttrValueArray(attrs, 'Note')
    );
  else if(type == 'Language')
    Realms.languageRules(rules, name);
  else if(type == 'Path') {
    Realms.pathRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Realms.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    Realms.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    Realms.raceRulesExtra(rules, name);
  } else if(type == 'Region')
    Realms.regionRules(rules, name);
  else if(type == 'School') {
    Realms.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    if(rules.basePlugin.schoolRulesExtra)
      rules.basePlugin.schoolRulesExtra(rules, name);
  } else if(type == 'Shield')
    Realms.shieldRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    var untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    Realms.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained != 'n' && untrained != 'N',
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergies')
    );
    if(rules.basePlugin.skillRulesExtra)
      rules.basePlugin.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = (school || 'Universal').substring(0, 4);
    for(var i = 0; i < groupLevels.length; i++) {
      var matchInfo = groupLevels[i].match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + groupLevels[i] + '" for spell ' + name);
        continue;
      }
      var group = matchInfo[1];
      var level = matchInfo[2] * 1;
      var fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
      // TODO indicate domain spells in attributes?
      var domainSpell = Realms.PATHS[group + ' Domain'] != null;
      Realms.spellRules
        (rules, fullName, school, group, level, description, domainSpell);
      rules.addChoice('spells', fullName, attrs);
    }
  } else if(type == 'Track')
    Pathfinder.trackRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Progression')
    );
  else if(type == 'Trait') {
    Pathfinder.traitRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Type'),
      QuilvynUtils.getAttrValue(attrs, 'Subtype')
    );
    if(Pathfinder.traitRulesExtra)
      Pathfinder.traitRulesExtra(rules, name);
  } else if(type == 'Weapon')
    Realms.weaponRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Category'),
      QuilvynUtils.getAttrValue(attrs, 'Damage'),
      QuilvynUtils.getAttrValue(attrs, 'Threat'),
      QuilvynUtils.getAttrValue(attrs, 'Crit'),
      QuilvynUtils.getAttrValue(attrs, 'Range')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Feature' && type != 'Path' && type != 'Spell') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replaceAll(' ', '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
Realms.alignmentRules = function(rules, name) {
  rules.basePlugin.alignmentRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with armor #name#, which adds #ac#
 * to the character's armor class, requires a #weight# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, imposes
 * #skillPenalty# on specific skills and yields a #spellFail# percent chance of
 * arcane spell failure.
 */
Realms.armorRules = function(
  rules, name, ac, weight, maxDex, skillPenalty, spellFail
) {
  rules.basePlugin.armorRules
    (rules, name, ac, weight, maxDex, skillPenalty, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires#. The class grants #hitDie# (format [n]'d'n)
 * additional hit points and #skillPoints# additional skill points with each
 * level advance. #attack# is one of '1', '1/2', or '3/4', indicating the base
 * attack progression for the class; similarly, #saveFort#, #saveRef#, and
 * #saveWill# are each one of '1/2' or '1/3', indicating the saving throw
 * progressions. #skills# indicate class skills for the class; see skillRules
 * for an alternate way these can be defined. #features# and #selectables# list
 * the fixed and selectable features acquired as the character advances in
 * class level, and #languages# lists any automatic languages for the class.
 * #casterLevelArcane# and #casterLevelDivine#, if specified, give the
 * Javascript expression for determining the caster level for the class; these
 * can incorporate a class level attribute (e.g., 'levels.Cleric') or the
 * character level attribute 'level'. If the class grants spell slots,
 * #spellAbility# names the ability for computing spell difficulty class, and
 * #spellSlots# lists the number of spells per level per day granted.
 */
Realms.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots
) {
  if(rules.basePlugin == window.Pathfinder) {
    for(var i = 0; i < requires.length; i++) {
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        requires[i] =
          requires[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
      }
    }
    for(var i = skills.length - 1; i >= 0; i--) {
      var skill = skills[i];
      if(!(skill in Pathfinder.SRD35_SKILL_MAP))
        continue;
      if(Pathfinder.SRD35_SKILL_MAP[skill] == '')
        skills.splice(i, 1);
      else
        skills[i] = Pathfinder.SRD35_SKILL_MAP[skill];
    }
  }
  rules.basePlugin.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Realms.classRulesExtra = function(rules, name) {

  var allFeats = rules.getChoices('feats');
  var classLevel = 'levels.' + name;
  var feats = null;

  if(name == 'Arcane Devotee') {

    if(allFeats == null)
      console.log('No feats defined for class "' + name + '"');
    else
      feats = [
        'Greater Spell Penetration', 'Improved Counterspell', 'Magical Artisan',
        'Shadow Weave Magic', 'Spell Penetration'
      ].concat(
        QuilvynUtils.getKeys(allFeats).filter(x => x.match(/Spell\s+Focus/))
      );

    rules.defineRule('featureNotes.arcaneDevoteeBonusFeats',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule('featCount.Arcane Devotee',
      'featureNotes.arcaneDevoteeBonusFeats', '=', null
    );
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule('magicNotes.devoteeEnlargeSpell',
      'charismaModifier', '+=', 'source > 0 ? source + 1 : 1'
    );
    rules.defineRule
      ('saveNotes.divineShroud', 'casterLevelArcane', '+=', '12 + source');
    rules.defineRule
      ('saveNotes.divineShroud.1', 'charismaModifier', '+=', '5 + source');
    rules.defineRule
      ('saveNotes.sacredDefense', classLevel, '+=', 'Math.floor(source / 2)');

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
    rules.defineRule('features.Spell Power',
      'features.Spell Power +1', '=', '1',
      'features.Spell Power +2', '=', '1',
      'features.Spell Power +3', '=', '1'
    );
    rules.defineRule('featureNotes.highArcana', classLevel, '=', null);
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule('magicNotes.spellPower',
      'features.Spell Power +1', '+=', '1',
      'features.Spell Power +2', '+=', '2',
      'features.Spell Power +3', '+=', '3'
    );
    rules.defineRule('magicNotes.arcaneFire', 'levels.Archmage', '=', null);
    rules.defineRule('magicNotes.arcaneFire.1',
      'features.Arcane Fire', '?', null,
      'levels.Archmage', '=', '400 + 40 * source'
    );
    rules.defineRule
      ('selectableFeatureCount.Archmage', 'featureNotes.highArcana', '+=', null);
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
    rules.defineRule('combatNotes.smiteInfidel.1', classLevel, '=', null);
    rules.defineRule('featureNotes.divineChampionBonusFeats',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('featCount.Fighter',
      'featureNotes.divineChampionBonusFeats', '+=', null
    );
    rules.defineRule('magicNotes.championLayOnHands',
      classLevel, '=', null,
      'charismaModifier', '*', null,
      'charisma', '?', 'source >= 12'
    );
    rules.defineRule('magicNotes.championLayOnHands.1',
      'features.Champion Lay On Hands', '?', null,
      'deity', '=', null
    );
    rules.defineRule('saveNotes.divineWrath', 'charismaModifier', '=', null);
    rules.defineRule
      ('saveNotes.sacredDefense', classLevel, '+=', 'Math.floor(source / 2)');

  } else if(name == 'Divine Disciple') {

    rules.defineRule
      ('selectableFeatureCount.Cleric', 'featureNotes.newDomain', '+=', '1');
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('saveNotes.sacredDefense', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('skillNotes.transcendence',
      'deity', '=', 'source.replace(/\\s*\\(.*\\)/, "")'
    );

  } else if(name == 'Divine Seeker') {

    rules.defineRule
      ('combatNotes.sneakAttack', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.locateCreature', classLevel, '=', null);
    rules.defineRule
      ('magicNotes.locateCreature.1', classLevel, '=', 'source * 40 + 400');
    rules.defineRule('magicNotes.locateObject', classLevel, '=', null);
    rules.defineRule
      ('magicNotes.locateObject.1', classLevel, '=', 'source * 40 + 400');
    // Unsure of the spell level for Obscure Object
    rules.defineRule
      ('magicNotes.obscureObject', 'charismaModifier', '=', '12 + source');
    rules.defineRule('magicNotes.sanctuary', classLevel, '=', null);
    rules.defineRule('magicNotes.sanctuary.1',
      classLevel, '?', null,
      'charismaModifier', '=', '11 + source'
    );
    rules.defineRule
      ('saveNotes.sacredDefense', classLevel, '+=', 'Math.floor(source / 2)');

  } else if(name == 'Guild Thief') {

    if(allFeats == null)
      console.log('No feats defined for class "' + name + '"');
    else
      feats = [
        'Alertness', 'Blind-Fight', 'Cosmopolitan', 'Education', 'Leadership',
        'Lightning Reflexes', 'Still Spell', 'Street Smart', 'Weapon Finesse',
        'Weapon Proficiency (Hand Crossbow)'
      ].concat(
        QuilvynUtils.getKeys(allFeats).filter(x => x.match(/Skill\s+Focus|Weapon\s+Focus|Track/))
      );

    rules.defineRule('combatNotes.improvedUncannyDodge',
      classLevel, '+=', null,
      '', '+', '4'
    );
    rules.defineRule('combatNotes.sneakAttack',
      classLevel, '+=', 'Math.floor((source + 1) / 2)'
    );
    rules.defineRule('featureNotes.guildThiefBonusFeats',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('featCount.Guild Thief',
      'featureNotes.guildThiefBonusFeats', '=', null
    );
    rules.defineRule('featureNotes.reputation',
      classLevel, '=', 'source >= 3 ? source - 2 : null'
    );

  } else if(name == 'Harper Scout') {

    rules.defineRule('combatNotes.favoredEnemy',
      classLevel, '+=', '1 + Math.floor(source / 4)'
    );
    rules.defineRule
      ('featCount.General', classLevel, '+=', 'source >= 2 ? 2 : null');
    rules.defineRule('skillNotes.bardicKnowledge', classLevel, '+=', null);
    rules.defineRule('skillNotes.favoredEnemy',
      classLevel, '+=', '1 + Math.floor(source / 4)'
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

    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.fear', classLevel, '=', 'source>=8 ? 3 : source>=6 ? 2 : 1');
    rules.defineRule('magicNotes.fear.1',
      'features.Fear', '?', null,
      'charismaModifier', '=', '13 + source'
    );
    rules.defineRule('magicNotes.fear.2',
      'features.Fear', '?', null,
      'casterLevels.C', '^=', null,
      'casterLevels.D', '^=', null,
      'casterLevels.S', '^=', null,
      'casterLevels.W', '^=', null
    );
    rules.defineRule('magicNotes.greaterCommand', classLevel, '=', null);
    rules.defineRule('magicNotes.greaterCommand.1',
      classLevel, '=', 'source>=3 ? Math.floor(source / 2) * 5 + 25 : null'
    );
    rules.defineRule('magicNotes.greaterCommand.2',
      classLevel, '?', 'source >= 10',
      'charismaModifier', '=', '15 + source'
    );

  } else if(name == 'Hierophant') {

    rules.defineRule
      ('featureNotes.hierophantSpecialAbilities', classLevel, '=', null);
    rules.defineRule('selectableFeatureCount.Hierophant',
      'featureNotes.hierophantSpecialAbilities', '+=', null
    );
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
      classLevel, '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule('magicNotes.fear', classLevel, '=', '1');
    rules.defineRule('magicNotes.fear.1',
      'features.Fear', '?', null,
      'charismaModifier', '=', '13 + source'
    );
    rules.defineRule('magicNotes.fear.2', classLevel, '=', null);
    rules.defineRule("magicNotes.inspireKnight'sCourage",
      classLevel, '=', 'Math.floor(source / 2)'
    );

  } else if(name == 'Red Wizard') {

    rules.defineRule('sumItemCreationAndMetamagicFeats',
      'sumItemCreationFeats', '=', null,
      'sumMetamagicFeats', '+', null
    );
    rules.defineRule('featureNotes.redWizardBonusFeats', classLevel, '=', '1');
    rules.defineRule
      ('featCount.Wizard', 'featureNotes.redWizardBonusFeats', '+=', null);
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.spellPower', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('saveNotes.specialistDefense',
      classLevel, '+=', 'Math.floor((source + 1) / 2) - (source >= 5 ? 1 : 0)'
    );
    rules.defineRule('selectableFeatureCount.Wizard',
      'magicNotes.enhancedSpecialization', '+', '1'
    );

  } else if(name == 'Runecaster') {

    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule('magicNotes.runePower',
      classLevel, '=', 'source >= 9 ? 3 : source >= 5 ? 2 : 1'
    );
    rules.defineRule('skillNotes.runeCraft',
      classLevel, '=', 'source>=7 ? 3 : Math.floor((source + 2) / 3)'
    );

  } else if(name == 'Shadow Adept') {

    rules.defineRule
      ('features.Insidious Magic', 'featureNotes.shadowFeats', '=', null);
    rules.defineRule
      ('features.Pernicious Magic', 'featureNotes.shadowFeats', '=', null);
    rules.defineRule
      ('features.Tenacious Magic', 'featureNotes.shadowFeats', '=', null);
    rules.defineRule
      ('featureNotes.shadowAdeptBonusFeats', classLevel, '=', '1');
    rules.defineRule
      ('featCount.Metamagic', 'featureNotes.shadowAdeptBonusFeats', '+=', null);
    rules.defineRule
      ('magicNotes.insidiousMagic', 'casterLevel', '=', 'source + 11');
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.perniciousMagic', 'casterLevel', '=', 'source + 11');
    rules.defineRule
      ('magicNotes.shieldOfShadows', 'casterLevel', '=', null);
    rules.defineRule
      ('magicNotes.shadowDouble', 'casterLevel', '=', null);
    rules.defineRule('magicNotes.shadowWalk', classLevel, '=', null);
    rules.defineRule
      ('magicNotes.spellPower', classLevel, '+=', 'Math.floor(source / 3)');
    rules.defineRule
      ('magicNotes.tenaciousMagic', 'casterLevel', '=', '15 + source');
    rules.defineRule
      ('saveNotes.greaterShieldOfShadows', classLevel, '=', 'source + 12');
    rules.defineRule('saveNotes.shadowDefense',
      classLevel, '=', 'Math.floor((source + 1) / 3)'
    );

  } else if(rules.basePlugin.classRulesExtra) {

    rules.basePlugin.classRulesExtra(rules, name);

  }

  if(feats != null && allFeats != null) {
    for(var j = 0; j < feats.length; j++) {
      var feat = feats[j];
      if(!(feat in allFeats)) {
        console.log('Feat "' + feat + '" undefined for class "' + name + '"');
        continue;
      }
      allFeats[feat] = allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
  }

};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a companion.
 */
Realms.companionRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  level
) {
  rules.basePlugin.companionRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, and #domains# and #weapons# list the associated
 * domains and favored weapons.
 */
Realms.deityRules = function(rules, name, alignment, domains, weapons) {
  rules.basePlugin.deityRules(rules, name, alignment, domains, weapons);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with familiar #name#, which has
 * abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The familiar has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a familiar.
 */
Realms.familiarRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  level
) {
  rules.basePlugin.familiarRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
Realms.featRules = function(rules, name, requires, implies, types) {
  rules.basePlugin.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name# that cannot be
 * derived directly from the abilities passed to featRules.
 */
Realms.featRulesExtra = function(rules, name) {

  var matchInfo;
  var notes;

  if(name == 'Artist') {
    rules.defineRule
      (/^skillModifier.Perform/, 'skillNotes.artist', '+', '2');
  } else if(name == 'Bloodline Of Fire') {
    rules.defineRule
      ('magicNotes.bloodlineOfFire', 'levels.Sorcerer', '?', null);
  } else if(name == 'Horse Nomad') {
    rules.defineRule('features.Weapon Proficiency (Composite Shortbow)',
      'combatNotes.horseNomad', '=', '1'
    );
  } else if(name == 'Insidious Magic') {
    rules.defineRule
      ('magicNotes.insidiousMagic', 'casterLevel', '=', 'source + 11');
  } else if(name == 'Militia') {
    rules.defineRule
      ('combatNotes.militia', 'region', '?', 'source != "Luiren"');
    rules.defineRule('combatNotes.militiaLuiren',
      'region', '?', 'source == "Luiren"',
      'features.Militia', '=', null
    );
    rules.defineRule('features.Weapon Proficiency (Longbow)',
      'combatNotes.militia', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Longspear)',
      'combatNotes.militia', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Shortbow)',
      'combatNotes.militiaLuiren', '=', '1'
    );
    rules.defineRule('features.Weapon Proficiency (Short Sword)',
      'combatNotes.militiaLuiren', '=', '1'
    );
  } else if(name == 'Mind Over Body') {
    rules.defineRule('combatNotes.mindOverBody.1',
      'combatNotes.mindOverBody', '?', null,
      'intelligenceModifier', '=', null,
      'constitutionModifier', '+', '-source'
    );
    rules.defineRule('combatNotes.mindOverBody.2',
      'combatNotes.mindOverBody', '=', '0',
      'sumMetamagicFeats', '+', null
    );
    rules.defineRule('hitPoints',
      'combatNotes.mindOverBody.1', '+', null,
      'combatNotes.mindOverBody.2', '+', null
    );
  } else if(name == 'Pernicious Magic') {
    rules.defineRule('magicNotes.perniciousMagic',
      'casterLevel', '=', 'source + 11'
    );
  } else if((matchInfo = name.match(/^Spellcasting\sProdigy\s\((.*)\)$/)) != null) {
    var clas = matchInfo[1];
    var spellCode = clas.charAt(0);
    var ability = {'Bard':'charisma', 'Cleric':'wisdom', 'Druid':'wisdom', 'Sorcerer':'charisma', 'Wizard':'intelligence'}[clas];
    rules.defineRule('spellDifficultyClass.' + clas,
      'magicNotes.spellcastingProdigy(' + clas + ')', '+', '1'
    );
    rules.defineRule('prodigyAbility' + clas,
      'magicNotes.spellcastingProdigy(' + clas + ')', '?', null,
      ability + 'Modifier', '=', 'source + 1'
    );
    for(var spellLevel = 1; spellLevel <= 5; spellLevel++) {
      rules.defineRule('spellSlots.' + spellCode + spellLevel,
        'prodigyAbility' + clas, '+', 'source == ' + spellLevel + ' ? 1 : null'
      );
    }
  } else if(name == 'Tenacious Magic') {
    rules.defineRule
      ('magicNotes.tenaciousMagic', 'casterLevel', '=', '15 + source');
  } else if(name == 'Tattoo Focus') {
    for(var school in rules.getChoices('schools')) {
      rules.defineRule
        ('spellDCSchoolBonus.' + school, 'magicNotes.tattooFocus', '+', '1');
    }
  } else if(rules.basePlugin.featRulesExtra) {
    rules.basePlugin.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Realms.featureRules = function(rules, name, sections, notes) {
  if(rules.basePlugin == window.Pathfinder) {
    for(var i = 0; i < sections.length; i++) {
      if(sections[i] != 'skill')
        continue;
      var note = notes[i];
      for(var skill in Pathfinder.SRD35_SKILL_MAP) {
        if(note.indexOf(skill) < 0)
          continue;
        var pfSkill = Pathfinder.SRD35_SKILL_MAP[skill];
        if(pfSkill == '' || note.indexOf(pfSkill) >= 0) {
          note = note.replace(new RegExp('[,/]?[^,/:]*' + skill + '[^,/]*', 'g'), '');
        } else {
          note = note.replace(new RegExp(skill, 'g'), pfSkill);
        }
      }
      notes[i] = note;
    }
  }
  rules.basePlugin.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with goody #name#, triggered by
 * a starred line in the character notes that matches #pattern#. #effect#
 * specifies the effect of the goody on each attribute in list #attributes#.
 * This is one of "increment" (adds #value# to the attribute), "set" (replaces
 * the value of the attribute by #value#), "lower" (decreases the value to
 * #value#), or "raise" (increases the value to #value#). #value#, if null,
 * defaults to 1; occurrences of $1, $2, ... in #value# reference capture
 * groups in #pattern#. #sections# and #notes# list the note sections
 * ("attribute", "combat", "companion", "feature", "magic", "save", or "skill")
 * and formats that show the effects of the goody on the character sheet.
 */
Realms.goodyRules = function(
  rules, name, pattern, effect, value, attributes, sections, notes
) {
  rules.basePlugin.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
Realms.languageRules = function(rules, name) {
  rules.basePlugin.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features listed in #features#. If the path
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
Realms.pathRules = function(
  rules, name, group, levelAttr, features, selectables, spellAbility,
  spellSlots
) {
  if(rules.basePlugin == window.Pathfinder)
    rules.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, [], [],
      spellAbility, spellSlots
    );
  else
    rules.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, spellAbility,
      spellSlots
    );
  // Add new domains to Cleric selections
  if(name.match(/Domain$/))
    QuilvynRules.featureListRules
      (rules, ["deityDomains =~ '" + name.replace(' Domain', '') + "' ? 1:" + name], 'Cleric', 'levels.Cleric', true);
}

/*
 * Defines in #rules# the rules associated with path #name# that cannot be
 * derived directly from the abilities passed to pathRules.
 */
Realms.pathRulesExtra = function(rules, name) {
  if(name == 'Family Domain') {
    rules.defineRule('magicNotes.familialProtection',
      'charismaModifier', '=', 'source > 1 ? source : 1'
    );
    rules.defineRule('magicNotes.familialProtection.1', 'level', '=', null);
  } else if(name == 'Halfling Domain') {
    rules.defineRule('skillNotes.sprightly', 'charismaModifier', '=', null);
  } else if(name == 'Mentalism Domain') {
    rules.defineRule('magicNotes.mentalWard', 'level', '=', 'source + 2');
  } else if(name == 'Nobility Domain') {
    rules.defineRule('magicNotes.inspireAllies',
      'charismaModifier', '=', 'source >= 1 ? source : null'
    );
  } else if(name == 'Ocean Domain') {
    rules.defineRule('magicNotes.waterBreathing', 'level', '=', '10 * source');
  } else if(name == 'Orc Domain') {
    rules.defineRule('combatNotes.smitePower', 'levels.Cleric', '=', null);
  } else if(name == 'Renewal Domain') {
    rules.defineRule('combatNotes.renewSelf', 'charismaModifier', '=', null);
  } else if(name == 'Storm Domain') {
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.stormfriend', '^=', '5');
  } else if(name == 'Trade Domain') {
    rules.defineRule('magicNotes.tradeSecrets', 'charismaModifier', '=', null);
  } else if(name == 'Undeath Domain') {
    rules.defineRule
      ('combatNotes.extraTurning', 'clericFeatures.Extra Turning', '+=', '4');
  } else if(rules.basePlugin.pathRulesExtra) {
    rules.basePlugin.pathRulesExtra(rules, name);
  }
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages. If the race
 * grants spell slots, #spellAbility# names the ability for computing spell
 * difficulty class, and #spellSlots# lists the number of spells per level per
 * day granted.
 */
Realms.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spellSlots
) {
  rules.basePlugin.raceRules
    (rules, name, requires, features, selectables, languages, spellAbility,
     spellSlots);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
Realms.raceRulesExtra = function(rules, name) {
  var matchInfo;
  if((matchInfo = name.match(/^(\w+)\sGenasi$/)) != null) {
    var element = matchInfo[1];
    var elementLowered = element.toLowerCase();
    rules.defineRule('saveNotes.elementalAffinity',
      'level', '=', '1 + Math.floor(source / 5)'
    );
    rules.defineRule('saveNotes.elementalAffinity.1',
      elementLowered + 'GenasiLevel', '=', '"' + element + '"'
    );
    rules.defineChoice('notes', 'validationNotes.' + elementLowered + 'GenasiCleric:Requires ' + element + ' Domain');
    rules.defineRule('validationNotes.' + elementLowered + 'GenasiCleric',
      'levels.Cleric', '?', null,
      elementLowered + 'GenasiLevel', '=', '-1',
      'clericFeatures.' + element + ' Domain', '+', '1'
    );
  }
  if(name == 'Aasimar') {
    rules.defineRule
      ('resistance.Acid', 'saveNotes.aasimarResistance', '^=', '5');
    rules.defineRule
      ('resistance.Cold', 'saveNotes.aasimarResistance', '^=', '5');
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.aasimarResistance', '^=', '5');
  } else if(name == 'Air Genasi') {
    rules.defineRule('casterLevels.Air Genasi', 'airGenasiLevel', '=', '5');
  } else if(name == 'Deep Gnome') {
    rules.defineRule
      ('saveNotes.svirfneblinSpellResistance', 'deepGnomeLevel', '=', 'source + 11');
    // Several web pages say that the DC for Deep Gnome spells is Charisma
    // based with a +4 racial modifier. The FG Campaign Setting says 10 +
    // spell level, so we go with that; otherwise, the value would be
    // 14 + source instead of 10
    rules.defineRule
      ('spellDifficultyClass.Svirfneblinish', 'charismaModifier', '=', '10');
    rules.defineRule
      ('spellResistance', 'saveNotes.svirfneblinSpellResistance', '^=', null);
  } else if(name == 'Drow Elf') {
    rules.defineRule('combatNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule
      ('saveNotes.drowElfSpellResistance', 'drowElfLevel', '=', 'source + 11');
    rules.defineRule('saveNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule('skillNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule
      ('spellResistance', 'saveNotes.drowElfSpellResistance', '^=', null);
  } else if(name == 'Earth Genasi') {
    rules.defineRule('casterLevels.Earth Genasi', 'earthGenasiLevel', '=', '5');
  } else if(name == 'Gray Dwarf') {
    rules.defineRule
      ('casterLevels.Duergar', 'grayDwarfLevel', '=', 'source * 2');
    rules.defineRule('saveNotes.lightSensitivity', 'grayDwarfLevel', '=', '2');
    rules.defineRule('skillNotes.lightSensitivity', 'grayDwarfLevel', '=', '2');
    rules.defineRule('combatNotes.lightSensitivity', 'grayDwarfLevel', '=','2');
  } else if(name == 'Tiefling') {
    rules.defineRule
      ('resistance.Cold', 'saveNotes.tieflingResistance', '^=', '5');
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.tieflingResistance', '^=', '5');
    rules.defineRule
      ('resistance.Fire', 'saveNotes.tieflingResistance', '^=', '5');
  } else if(name == 'Water Genasi') {
    rules.defineRule('casterLevels.Water Genasi', 'waterGenasiLevel', '=', '5');
  } else if(rules.basePlugin.raceRulesExtra) {
    rules.basePlugin.raceRulesExtra(rules, name);
  }
};

/* Defines in #rules# the rules associated with region #name#. */
Realms.regionRules = function(rules, name, features) {
  if(!name) {
    console.log('Empty region name');
    return;
  }
  // No rules pertain to region
};

/*
 * Defines in #rules# the rules associated with magic school #name#, which
 * grants the list of #features#.
 */
Realms.schoolRules = function(rules, name, features) {
  rules.basePlugin.schoolRules(rules, name, features);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, imposes #skillPenalty# on specific skills and yields a
 * #spellFail# percent chance of arcane spell failure.
 */
Realms.shieldRules = function(
  rules, name, ac, profLevel, skillFail, spellFail
) {
  rules.basePlugin.shieldRules
    (rules, name, ac, profLevel, skillFail, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * basic ability #ability#. #untrained#, if specified, is a boolean indicating
 * whether or not the skill can be used untrained; the default is true.
 * #classes# lists the classes for which this is a class skill; a value of
 * "all" indicates that this is a class skill for all classes. #synergies#
 * lists any synergies with other skills and abilities granted by high ranks in
 * this skill.
 */
Realms.skillRules = function(
  rules, name, ability, untrained, classes, synergies
) {
  rules.basePlugin.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a concise
 * description of the spell's effects.
 */
Realms.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell
) {
  rules.basePlugin.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #profLevel# proficiency level to use effectively and belongs to weapon
 * category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their spelled-out
 * equivalents). The weapon does #damage# HP on a successful attack and
 * threatens x#critMultiplier# (default 2) damage on a roll of #threat# (default
 * 20). If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet.
 */
Realms.weaponRules = function(
  rules, name, profLevel, category, damage, threat, critMultiplier, range
) {
  rules.basePlugin.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by base method
};

/*
 * Returns the list of editing elements needed by #choiceRules# to add a #type#
 * item to #rules#.
 */
Realms.choiceEditorElements = function(rules, type) {
  if(type == 'Region')
    return []; // empty
  return rules.basePlugin.choiceEditorElements(rules, type);
};

/* Sets #attributes#'s #attribute# attribute to a random value. */
Realms.randomizeOneAttribute = function(attributes, attribute) {
  if(attribute == 'region') {
    var choices = [];
    var races = this.getChoices('races');
    var regions = this.getChoices('regions');
    for(var region in regions) {
      if(races[region] == null || region == attributes.race) {
        choices[choices.length] = region;
      }
    }
    attributes[attribute] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else {
    this.basePlugin.randomizeOneAttribute.apply(this, [attributes, attribute]);
    if(attribute == 'levels') {
      // Recompute experience to account for level offset for some races
      var attrs = this.applyRules(attributes);
      if(QuilvynUtils.sumMatching(attrs, /LevelAdjustment/) > 0) {
        var level = QuilvynUtils.sumMatching(attrs, /^levels\./) +
                    QuilvynUtils.sumMatching(attrs, /LevelAdjustment/);
        var max = level * (level + 1) * 1000 / 2 - 1;
        var min = level * (level - 1) * 1000 / 2;
        if(!attributes.experience || attributes.experience < min)
          attributes.experience = QuilvynUtils.random(min, max);
      }
    }
  }
};

/* Returns an array of plugins upon which this one depends. */
Realms.getPlugins = function() {
  var base = this.basePlugin == window.SRD35 ? window.PHB35 : this.basePlugin;
  return [base].concat(base.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
Realms.ruleNotes = function() {
  return '' +
    '<h2>Quilvyn Forgotten Realms Rule Set Notes</h2>\n' +
    '<p>\n' +
    'Quilvyn Forgotten Realms Rule Set Version ' + Realms.VERSION + '\n' +
    '</p>\n' +
    '<h3>Usage Notes</h3>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn gives Drow Elves proficiency in both short sword and\n' +
    '    rapier, rather than a choice of the two.\n' +
    '  </li><li>\n' +
    '    Regional languages are not included in character languages lists.\n' +
    '  </li><li>\n' +
    '    Harper Scout\'s "Harper Knowledge" feature is renamed "Bardic\n' +
    '    Knowledge", since the two are identical and stack.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '<h3>Copyrights and Licensing</h3>\n' +
    '<p>\n' +
    "Quilvyn's Forgotten Realms Rule Set is unofficial Fan Content " +
    "permitted under Wizards of the Coast's " +
    '<a href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</a>.\n' +
    '</p><p>\n' +
    'Quilvyn is not approved or endorsed by Wizards of the Coast. Portions ' +
    'of the materials used are property of Wizards of the Coast. ©Wizards of ' +
    'the Coast LLC.\n' +
    '</p><p>\n' +
    'Dungeons & Dragons Forgotten Realms Campaign Setting © 2001 Wizards of ' +
    'the Coast, Inc.\n' +
    '</p><p>\n' +
    "Dungeons & Dragons Player's Handbook v3.5 © 2003 Wizards of the Coast, " +
    'Inc.\n' +
    '</p>\n';
};
