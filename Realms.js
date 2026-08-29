/*
Copyright 2026, James J. Hayes

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
/* jshint forin: false */
/* globals Quilvyn, QuilvynRules, QuilvynUtils, SRD35, PHB35, Pathfinder */
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

  let rules = new QuilvynRules(
    'Forgotten Realms - ' + (Realms.USE_PATHFINDER ? 'Pathfinder 1E' : 'D&D v3.5'),
     Realms.VERSION
  );
  rules.plugin = Realms;
  rules.basePlugin = Realms.USE_PATHFINDER ? Pathfinder : SRD35;
  Realms.rules = rules;

  Realms.CHOICES = rules.basePlugin.CHOICES.concat(Realms.CHOICES_ADDED);
  rules.defineChoice('choices', Realms.CHOICES);
  rules.choiceEditorElements = Realms.choiceEditorElements;
  rules.choiceRules = Realms.choiceRules;
  rules.removeChoice = SRD35.removeChoice;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.getPlugins = Realms.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Realms.randomizeOneAttribute;
  Realms.RANDOMIZABLE_ATTRIBUTES =
    rules.basePlugin.RANDOMIZABLE_ATTRIBUTES.concat
    (Realms.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', Realms.RANDOMIZABLE_ATTRIBUTES);
  rules.getChoices = SRD35.getChoices;
  rules.ruleNotes = Realms.ruleNotes;

  if(rules.basePlugin == window.Pathfinder) {
    SRD35.ABBREVIATIONS.CMB = 'Combat Maneuver Bonus';
    SRD35.ABBREVIATIONS.CMD = 'Combat Maneuver Defense';
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
  for(let c in Realms.CLASS_FEATURES_ADDED) {
    let features =
      QuilvynUtils.getAttrValueArray(Realms.CLASS_FEATURES_ADDED[c],'Features');
    let selectables =
      QuilvynUtils.getAttrValueArray(Realms.CLASS_FEATURES_ADDED[c], 'Selectables');
    if(c in Realms.CLASSES) {
      Realms.CLASSES[c] =
        Realms.CLASSES[c].replace(
          'Features=', 'Features="' + features.join('","') + '",'
        ).replace(
          'Selectables=', 'Selectables="' + selectables.join('","') + '",'
        );
    } else if(c in Realms.NPC_CLASSES) {
      Realms.NPC_CLASSES[c] =
        Realms.NPC_CLASSES[c].replace(
          'Features=', 'Features="' + features.join('","') + '",'
        ).replace(
          'Selectables=', 'Selectables="' + selectables.join('","') + '",'
        );
    }
  }
  Realms.FAMILIARS = Object.assign({}, rules.basePlugin.FAMILIARS);
  Realms.FEATS =
    Object.assign({}, rules.basePlugin.FEATS, Realms.FEATS_ADDED);
  Realms.FEATURES =
    Object.assign({}, rules.basePlugin.FEATURES, Realms.FEATURES_ADDED);
  Realms.GOODIES = Object.assign({}, rules.basePlugin.GOODIES);
  Realms.LANGUAGES =
    Object.assign({}, rules.basePlugin.LANGUAGES, Realms.LANGUAGES_ADDED);
  Realms.RACES['Gold Dwarf'] =
    rules.basePlugin.RACES.Dwarf
      .replace('Dwarf Ability', 'Gold Dwarf Ability')
      .replace('Dwarf Enmity', 'Gold Dwarf Enmity');
  Realms.RACES['Gray Dwarf'] =
    rules.basePlugin.RACES.Dwarf
      .replace('Common', 'Undercommon')
      .replace('Dwarf Ability Adjustment', 'Gray Dwarf Ability Adjustment')
      .replace(/['"]?Darkvision['"]?/, '"Extended Darkvision"')
      .replace('Features=', 'Features="Keen Senses (Gray Dwarf)","Gray Dwarf Immunities","Gray Dwarf Magic","Light Sensitivity","Racial Level Adjustment","Stealthy Movement",');
  Realms.RACES['Shield Dwarf'] = rules.basePlugin.RACES.Dwarf;
  Realms.RACES['Drow Elf'] = rules.basePlugin.RACES.Elf
      .replace('Common', 'Undercommon')
      .replace('Elf Ability Adjustment', 'Drow Elf Ability Adjustment')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace(/Weapon Proficiency[^'"]*/, 'Weapon Proficiency (Hand Crossbow/Light Crossbow/Rapier/Shortsword)')
      .replace('Features=', 'Features="Drow Elf Magic","Drow Elf Spell Resistance","Light Blindness","Light Sensitivity","Racial Level Adjustment","Defy Spells",');
  Realms.RACES['Moon Elf'] = rules.basePlugin.RACES.Elf;
  Realms.RACES['Sun Elf'] =
    rules.basePlugin.RACES.Elf.replace('Elf Ability', 'Sun Elf Ability');
  Realms.RACES['Wild Elf'] =
    rules.basePlugin.RACES.Elf.replace('Elf Ability', 'Wild Elf Ability');
  Realms.RACES['Wood Elf'] =
    rules.basePlugin.RACES.Elf.replace('Elf Ability', 'Wood Elf Ability');
  Realms.RACES['Deep Gnome'] =
    rules.basePlugin.RACES.Gnome
      .replace('Common', 'Undercommon')
      .replace('Gnome Ability Adjustment', 'Deep Gnome Ability Adjustment')
      .replace('Dodge Giants', 'Exceptional Dodger')
      .replace('Gnome Magic', 'Deep Gnome Magic')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace('Features=', 'Features="Resilient","Racial Level Adjustment",Inconspicuous,Stonecunning,"Deep Gnome Spell Resistance",');
  Realms.RACES['Rock Gnome'] = rules.basePlugin.RACES.Gnome;
  Realms.RACES['Half-Elf'] = rules.basePlugin.RACES['Half-Elf'];
  Realms.RACES['Half-Orc'] = rules.basePlugin.RACES['Half-Orc'];
  Realms.RACES['Ghostwise Halfling'] =
    rules.basePlugin.RACES.Halfling
      .replace(/['"]?Fortunate['"]?/, '"Speak Without Sound"');
  Realms.RACES['Lightfoot Halfling'] = rules.basePlugin.RACES.Halfling;
  Realms.RACES['Strongheart Halfling'] =
    rules.basePlugin.RACES.Halfling
      .replace(/['"]?Fortunate['"]?/, '"Bonus Feat (Strongheart Halfling)"');
  Realms.RACES.Human = rules.basePlugin.RACES.Human;
  Realms.SCHOOLS = Object.assign({}, rules.basePlugin.SCHOOLS);
  Realms.SHIELDS = Object.assign({}, rules.basePlugin.SHIELDS);
  Realms.SKILLS = Object.assign({}, rules.basePlugin.SKILLS);
  Realms.SPELLS = Object.assign
    ({}, Realms.USE_PATHFINDER ? Pathfinder.SPELLS :
         window.PHB35 != null ? PHB35.SPELLS : SRD35.SPELLS,
     Realms.SPELLS_ADDED);
  for(let s in Realms.SPELLS_LEVELS) {
    let levels = Realms.SPELLS_LEVELS[s];
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
    rules, Realms.ALIGNMENTS, Realms.CLASSES, Realms.DEITIES, Realms.RACES,
    Realms.REGIONS, Realms.PRESTIGE_CLASSES, Realms.NPC_CLASSES
  );

  Quilvyn.addRuleSet(rules);

}

Realms.VERSION = '2.4.1.1';

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
for(let c in Realms.CLASS_FEATURES_ADDED) {
  let features =
    QuilvynUtils.getAttrValueArray(Realms.CLASS_FEATURES_ADDED[c], 'Features');
  let selectables =
    QuilvynUtils.getAttrValueArray(Realms.CLASS_FEATURES_ADDED[c], 'Selectables');
  if(c in Realms.CLASSES) {
    Realms.CLASSES[c] =
      Realms.CLASSES[c].replace(
        'Features=', 'Features="' + features.join('","') + '",'
      ).replace(
        'Selectables=', 'Selectables="' + selectables.join('","') + '",'
      );
  } else if(c in Realms.NPC_CLASSES) {
    Realms.NPC_CLASSES[c] =
      Realms.NPC_CLASSES[c].replace(
        'Features=', 'Features="' + features.join('","') + '",'
      ).replace(
        'Selectables=', 'Selectables="' + selectables.join('","') + '",'
      );
  }
}
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
      '"1:Arcane Caster Level Bonus","1:Enlarge Spell (Arcane Devotee)",' +
      '"2:Alignment Focus","2:Sacred Defense","3:Arcane Devotee Bonus Feats",' +
      '"5:Divine Shroud"',
  'Archmage':
    SRD35.PRESTIGE_CLASSES.Archmage
    .replace('"1:Spell Power:High Arcana"', '"1:Spell Power +1:High Arcana","1:Spell Power +2:High Arcana","1:Spell Power +3:High Arcana"'),
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
      '"2:Divine Champion Bonus Feats","1:Lay On Hands (Divine Champion)",' +
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
      '"1:Divine Caster Level Bonus","1:Divine Emissary","1:New Domain",' +
      '"2:Sacred Defense","3:Imbue With Spell Ability","5:Transcendence"',
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
      '"2:Harper Skill Focus","3:Tymora\'s Smile","4:Lliira\'s Heart",' +
      '"5:Craft Harper Item" ' +
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
    SRD35.PRESTIGE_CLASSES.Hierophant
    .replace(/(skills.Knowledge\s+.Religion.\s+>=\s+15)/, 'skills.Knowledge (Nature) >= 15 || $1')
    .replace('Spell Power', 'Spell Power +2'),
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
      '"1:Heroic Shield","1:Rallying Cry",' +
      '"2:Inspire Courage (Purple Dragon Knight)","3:Fear",' +
      '"4:Oath Of Wrath","5:Final Stand"',
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
      '"1:Arcane Caster Level Bonus","1:Enhanced Specialization",' +
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
      '"1:Divine Caster Level Bonus","1:Rune Craft","2:Rune Power",' +
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
    // N.B. requires wisdom >= 13, but the feat reduces wisdom by 2 without
    // violating the prerequisite, so we make the requirement 11
    'Require="wisdom >= 11 || deity == \'Shar\'"',
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

  // Races

  // Gold Dwarves
  'Gold Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Dexterity"',
  'Gold Dwarf Enmity':'Section=combat Note="+1 attacks vs. aberrations"',

  // Gray Dwarves
  'Extended Darkvision':
    'Section=feature ' +
    'Note="R120\' Has black and white vision in complete darkness"',
  'Gray Dwarf Ability Adjustment':
    'Section=ability Note="+2 Constitution/-4 Charisma"',
  'Gray Dwarf Immunities':
    'Section=save ' +
    'Note="Immune to paralysis, phantasms, and magic and alchemical poisons"',
  'Gray Dwarf Magic':
    'Section=magic ' +
    'Note="Can cast <i>Enlarge Person</i> and <i>Invisibility</i> on self once per day" ' +
    'Spells="Enlarge Person","Invisibility" ' +
    'SpellAbility=Intelligence',
  'Light Sensitivity':
    'Section=combat,save,skill ' +
    'Note=' +
      '"-%V attacks in bright light",' +
      '"-%V saves in bright light",' +
      '"-%V checks in bright light"',
  'Keen Senses (Gray Dwarf)':'Section=skill Note="+1 Listen/+1 Spot"',
  'Racial Level Adjustment':'Section=ability Note="-%V Level"',
  'Stealthy Movement':'Section=skill Note="+4 Move Silently"',

  // Drow
  'Defy Spells':
    'Section=save Note="+2 Will vs. spells and spell-like abilities"',
  'Drow Elf Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Dexterity/-2 Constitution/+2 Intelligence/+2 Charisma"',
  'Drow Elf Magic':
    'Section=magic ' +
    'Note="Can cast <i>Dancing Lights</i>, <i>Darkness</i>, and <i>Faerie Fire</i> once per day" ' +
    'Spells="Dancing Lights","Darkness","Faerie Fire" ' +
    'SpellAbility=Charisma',
  'Drow Elf Spell Resistance':'Section=save Note="Has SR %V"',
  // Extended Darkvision as above
  'Light Blindness':
    'Section=feature ' +
    'Note="Abrupt exposure to bright light inflicts blinded for 1 rd and -1 to attacks, saves, and checks"',
  // Racial Level Adjustment as above

  // Sun Elf
  'Sun Elf Ability Adjustment':
    'Section=ability Note="+2 Intelligence/-2 Constitution"',

  // Wild Elf
  'Wild Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Intelligence"',

  // Wood Elf
  'Wood Elf Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Strength/+2 Dexterity/-2 Constitution/-2 Intelligence/-2 Charisma"',

  // Deep Gnome
  'Deep Gnome Ability Adjustment':
    'Section=ability Note="-2 Strength/+2 Dexterity/+2 Wisdom/-4 Charisma"',
  'Deep Gnome Magic':
    'Section=magic ' +
    'Note="Has continuous <i>Nondetection</i> effects and can cast <i>Speak With Animals</i>  to communicate with burrowing mammals for 1 min, <i>Blindness/Deafness</i>, <i>Blur</i>, and <i>Disguise Self</i> once per day" ' +
    'Spells="Nondetection","Speak With Animals","Blindness/Deafness","Blur","Disguise Self" ' +
    'SpellAbility=Intelligence',
  'Deep Gnome Spell Resistance':'Section=save Note="Has SR %V"',
  'Exceptional Dodger':'Section=combat Note="+4 dodge bonus to Armor Class"',
  // Extended Darkvision as above
  'Inconspicuous':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Hide",' +
      '"+2 Hide in darkened underground areas"',
  // Racial Level Adjustment as above
  'Resilient':'Section=save Note="+2 Fortitude/+2 Reflex/+2 Will"',
  // Stonecunning as SRD35

  // Ghostwise Halfling
  'Speak Without Sound':
    'Section=skill ' +
    'Note="R20\' Can communicate telepathically in a shared language"',

  // Strongheart Halfling
  'Bonus Feat (Strongheart Halfling)':'Section=feature Note="+1 General Feat"',

  // Aasimar
  'Aasimar Ability Adjustment':'Section=ability Note="+2 Wisdom/+2 Charisma"',
  'Aasimar Alertness':'Section=skill Note="+2 Listen/+2 Spot"',
  'Aasimar Resistance':
    'Section=save Note="Has resistance 5 to acid, cold, and electricity"',
  'Aasimar Magic':
    'Section=magic ' +
    'Note="Can cast <i>Light</i> once per day" ' +
    'Spells="Light" ' +
    'SpellAbility=Charisma',
  // Darkvision as SRD35
  'Outsider':
    'Section=save ' +
    'Note="Affected by spells that target outsiders, not humanoids"',
  // Racial Level Adjustment as above

  // Air Genasi
  'Air Genasi Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Wisdom/-2 Charisma"',
  'Air Genasi Magic':
    'Section=magic ' +
    'Note="Can cast <i>Levitate</i> once per day" ' +
    'Spells="Levitate" ' +
    'SpellAbility=Charisma',
  'Breathless':
    'Section=save ' +
    'Note="Has immunity to drowning, suffocation, and inhalation effects"',
  'Clerical Focus':'Section=validation Note="Requires %1 domain"',
  'Genasi Resistance':'Section=save Note="+%{level//5+1} vs. %V spells"',
  // Outsider as above
  // Racial Level Adjustment as above

  // Earth Genasi
  // Clerical Focus as above
  // Darkvision as above
  'Earth Genasi Ability Adjustment':
    'Section=ability Note="+2 Strength/+2 Constitution/-2 Wisdom/-2 Charisma"',
  'Earth Genasi Magic':
    'Section=magic ' +
    'Note="Can cast <i>Pass Without Trace</i> once per day" ' +
    'Spells="Pass Without Trace" ' +
    'SpellAbility=Wisdom',
  // Genasi Resistance as above
  // Outsider as above
  // Racial Level Adjustment as above

  // Fire Genasi
  // Clerical Focus as above
  'Control Flame':
    'Section=magic ' +
    'Note="R10\' Can shrink or expand a natural fire for 5 min once per day"',
  // Darkvision as above
  'Fire Genasi Ability Adjustment':
    'Section=ability Note="+2 Intelligence/-2 Charisma"',
  // Genasi Resistance as above
  // Outsider as above
  // Racial Level Adjustment as above

  // Water Genasi
  'Amphibious':'Section=feature Note="Can breathe water"',
  // Clerical Focus as above
  // Darkvision as above
  // Genasi Resistance as above
  'Natural Swimmer':'Section=ability Note="Has a 30\' swim Speed"',
  // Outsider as above
  // Racial Level Adjustment as above
  'Water Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Charisma"',
  'Water Genasi Magic':
    'Section=magic ' +
    'Note="Can cast <i>Create Water</i> once per day" ' +
    'Spells="Create Water" ' +
    'SpellAbility=Wisdom',

  // Tiefling
  // Darkvision as above
  // Outsider as above
  // Racial Level Adjustment as above
  'Sneaky':'Section=skill Note="+2 Bluff/+2 Hide"',
  'Tiefling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Charisma"',
  'Tiefling Magic':
    'Section=magic ' +
    'Note="Can cast <i>Darkness</i> once per day" ' +
    'Spells="Darkness" ' +
    'SpellAbility=Charisma',
  'Tiefling Resistance':
    'Section=save Note="Has resistance 5 to cold, electricity, and fire"',

  // Feats
  'Arcane Preparation':
    'Section=magic ' +
    'Note="Can use spell slots to prepare arcane spells ahead of time; applying metamagic effects during preparation does not extend a spell\'s casting time"',
  'Arcane Schooling':
    'Section=feature ' +
    'Note="Can choose an arcane class as an additional favored class"',
  'Artist':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Perform",' +
      '"+2 on a choice of artistic Craft skill"',
  'Blooded':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Initiative",' +
      '"+2 Spot"',
  'Bloodline Of Fire':
    'Section=magic,save ' +
    'Note=' +
      '"+2 spell DC for sorcerer fire spells",' +
      '"+4 vs. fire effects"',
  'Bullheaded':
    'Section=save,skill ' +
    'Note=' +
      '"+1 Will",' +
      '"+2 Intimidate"',
  'Cosmopolitan':
    'Section=skill ' +
    'Note="Chosen skill is class skill with a +2 bonus on checks"',
  'Courteous Magocracy':'Section=skill Note="+2 Diplomacy/+2 Spellcraft"',
  'Create Portal':'Section=magic Note="Can create magical portals"',
  'Daylight Adaptation':
    'Section=feature Note="Suffers no penalties from bright light"',
  'Delay Spell':
    'Section=magic ' +
    'Note="Can delay the activation of a self area, personal, or touch spell for 1-5 rd"',
  'Discipline':
    'Section=save,skill ' +
    'Note=' +
      '"+1 Will",' +
      '"+2 Concentration"',
  'Education':
    'Section=skill,skill ' +
    'Note=' +
      '"All Knowledge skills are class skills",' +
      '"+1 on 2 choices of Knowledge skills"',
  // 3.0 Animal Empathy, Intuit Direction => 3.5 Handle Animal, Survival
  'Ethran':
    'Section=skill,skill ' +
    'Note=' +
      '"+2 Handle Animal/+2 Survival",' +
      '"+2 on Charisma skills when interacting with Rashemi"',
  'Foe Hunter':
    'Section=combat ' +
    'Note="When fighting a regional foe, inflicts +1 HP with melee weapons and ranged weapons within 30\' and gains a x2 critical threat range"',
  // 3.0 Wilderness Lore => 3.5 Survival
  'Forester':'Section=skill Note="+2 Heal/+2 Survival"',
  // Identical to SRD35, but +3 DC instead of +1
  'Greater Spell Focus (%school)':'Section=magic Note="+3 Spell DC (%school)"',
  // Greater Spell Penetration as SRD3.5
  'Horse Nomad':
    'Section=combat,skill ' +
    'Note=' +
      '"Weapon Proficiency (Composite Shortbow)",' +
      '"+2 Ride"',
  // Improved Counterspell as SRD3.5
  // Improved Familiar as SRD3.5
  'Innate Spell':
    'Section=magic ' +
    'Note="Can use chosen spells as spell-like abilities once per rd; each choice permanently uses a spell slot 8 levels higher"',
  'Inscribe Rune':
    'Section=magic ' +
    'Note="Can store chosen divine spells in runes that activate when triggered"',
  'Insidious Magic':
    'Section=magic ' +
    'Note="Weave casters require a successful DC %{11+(casterLevel||0)} caster level check to detect self spells other than evocation and transmutation, and self requires a successful caster level check (DC 9 + target caster level) to detect Weave spells other than enchantment, illusion, and necromancy"',
  'Luck Of Heroes':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Magical Artisan':
    'Section=magic ' +
    'Note="Reduces the cost of creating a chosen type of magic item by 25%"',
  'Magical Training':
    'Section=magic ' +
    'Note="Can cast <i>Dancing Lights</i>, <i>Daze</i>, and <i>Mage Hand</i> once per day" ' +
    'Spells="Dancing Lights","Daze","Mage Hand" ' +
    'SpellAbility=Intelligence',
  'Mercantile Background':
    'Section=skill,skill ' +
    'Note="+2 Appraise",' +
    '"+2 on a choice of Craft or Profession skill"',
  'Militia':'Section=combat Note="Weapon Proficiency (Longbow; Longspear)"',
  'Militia (Luiren)':
    'Section=combat Note="Weapon Proficiency (Shortbow; Short Sword)"',
  'Mind Over Body':
    'Section=combat,combat ' +
    'Note=' +
      '"+%1 Hit Points from metamagic feats",' +
      '"Can add Intelligence modifier instead of Constitution modifier to Hit Points at 1st level"',
  'Pernicious Magic':
    'Section=magic ' +
    'Note="Weave casters require a successful DC %{11+(casterLevel||0)} caster level check to counter self spells other than evocation and transmutation, and self requires a successful caster level check (DC 9 + target caster level) to counter Weave spells other than enchantment, illusion, and necromancy; does not affect the use of <i>Dispel Magic</i> to counter spells"',
  'Persistent Spell':
    'Section=magic ' +
    'Note="Can cast a spell using a spell slot 4 levels higher than normal to increase its duration to 24 hr; can be used only with personal or fixed-ranged spells with a non-instantaneous duration"',
  'Resist Poison Feat':'Section=save Note="+4 vs. poison"',
  'Saddleback':'Section=skill Note="+3 Ride"',
  'Shadow Weave Magic':
    'Section=ability,ability,magic,magic ' +
    'Note=' +
      '"-2 Wisdom",' +
      '"-2 Wisdom penalty can be reversed only via <i>Atonement</i> cast by a cleric of Shar",' +
      // TODO: Implement
      '"+1 DC on Enchantment, Illusion, Necromancy, and darkness descriptor spells/-1 caster level on non-darkness Evocation and Transmutation spells",' +
      '"+1 checks to overcome resistance on enchantment, illusion, necromancy, and darkness descriptor spells/Cannot cast light descriptor spells"',
  'Signature Spell':
    'Section=magic ' +
    'Note="Can cast a chosen mastered spell in place of a prepared arcane spell"',
  'Silver Palm':'Section=skill Note="+2 Appraise/+2 Bluff"',
  'Smooth Talk':'Section=skill Note="+2 Diplomacy/+2 Sense Motive"',
  'Snake Blood':
    'Section=save,save ' +
    'Note=' +
      '"+1 Reflex",' +
      '"+2 vs. poison"',
  'Spellcasting Prodigy (Bard)':
    'Section=magic ' +
    // TODO: Implement
    'Note="+1 spell DC/+2 Charisma for acquiring bonus spells"',
  'Spellcasting Prodigy (Cleric)':
    'Section=magic ' +
    // TODO: Implement
    'Note="+1 spell DC/+2 Wisdom for acquiring bonus spells"',
  'Spellcasting Prodigy (Druid)':
    'Section=magic ' +
    // TODO: Implement
    'Note="+1 spell DC/+2 Wisdom for acquiring bonus spells"',
  'Spellcasting Prodigy (Sorcerer)':
    'Section=magic ' +
    // TODO: Implement
    'Note="+1 spell DC/+2 Charisma for acquiring bonus spells"',
  'Spellcasting Prodigy (Wizard)':
    'Section=magic ' +
    // TODO: Implement
    'Note="+1 spell DC/+2 Intelligence for acquiring bonus spells"',
  'Stealthy':'Section=skill Note="+2 Hide/+2 Move Silently"',
  'Street Smart':'Section=skill Note="+2 Bluff/+2 Gather Information"',
  'Strong Soul':
    'Section=save,save ' +
    'Note=' +
      '"+1 Fortitude/+1 Will",' +
      '"+1 vs. draining and death"',
  'Survivor':
    'Section=save,skill ' +
    'Note=' +
      '"+1 Fortitude",' +
      // 3.0 Wilderness Lore => 3.5 Survival
      '"+2 Survival"',
  'Tattoo Focus':
    'Section=magic,magic ' +
    'Note=' +
      // TODO: Implement
      '"+1 DC on %V spells",' +
      '"+1 caster level to overcome spell resistance with %V spells"',
  'Tenacious Magic':
    'Section=magic ' +
    'Note="Weave casters require a successful DC %{15+(casterLevel||0)} caster level check to dispel self spells other than evocation and transmutation, and self requires a successful caster level check (DC 13 + target caster level) to dispel Weave spells other than enchantment, illusion, and necromancy"',
  'Thug':
    'Section=combat,skill ' +
    'Note=' +
      '"+2 Initiative",' +
      '"+2 Intimidate"',
  'Thunder Twin':
    'Section=ability,skill ' +
    'Note=' +
      '"+2 Charisma checks",' +
      // 3.0 Intuit Direction => 3.5 Survival
      '"Successful DC 15 Survival determines the direction to twin"',
  'Treetopper':
    'Section=combat,skill ' +
    'Note=' +
      '"Retains Dexterity bonus to Armor Class when climbing, and climbing gives attackers no bonus",' +
      '"+2 Climb"',
  'Twin Spell':
    'Section=magic ' +
    'Note="Can cast a spell using a spell slot 4 levels higher than normal to have it take effect twice"',
  'Twin Sword Style':
    'Section=combat ' +
    'Note="Gains a +2 stacking armor bonus to Armor Class vs. a chosen foe when using two swords; loss of Dexterity bonus to Armor Class negates"',

  // Prestige classes

  // Arcane Devotee
  'Alignment Focus':
    'Section=magic ' +
    'Note="+1 caster level on spells from a chosen alignment component"',
  'Arcane Caster Level Bonus':SRD35.FEATURES['Arcane Caster Level Bonus'],
  'Arcane Devotee Bonus Feats':
    'Section=feature Note="+%V Arcane Devotee Feats"',
  'Divine Shroud':
    'Section=save ' +
    'Note="Can gain SR %{casterLevelArcane+12} for %{charismaModifier+5} rd once per day"',
  'Enlarge Spell (Arcane Devotee)':
    'Section=magic ' +
    'Note="Can cast a spell at double its normal range %{charismaModifier>0?charismaModifier+1+\' times\':\'once\'} per day"',
  'Sacred Defense':
    'Section=save ' +
    'Note="+%V vs. divine spells and outsiders\' spell-like and supernatural abilities"',

  // Archmage
  // Arcane Caster Level Bonus as above
  'Arcane Fire':SRD35.FEATURES['Arcane Fire'],
  'Arcane Reach':SRD35.FEATURES['Arcane Reach'],
  'High Arcana':SRD35.FEATURES['High Arcana'],
  'Mastery Of Counterspelling':SRD35.FEATURES['Mastery Of Counterspelling'],
  'Mastery Of Elements':SRD35.FEATURES['Mastery Of Elements'],
  'Mastery Of Shaping':SRD35.FEATURES['Mastery Of Shaping'],
  'Spell-Like Ability':SRD35.FEATURES['Spell-Like Ability'],
  // N.B. different effects from SRD35
  'Spell Power':
    'Section=magic ' +
    'Note="+%V spell DC and caster level checks to overcome resistance on %1 spells"',
  'Spell Power +1':
    'Section=magic ' +
    'Note="+1 Spell Power%{levels.Archmage?\'; costs a 5th-level spell slot to acquire\':\'\'}"',
  'Spell Power +2':
    'Section=magic ' +
    'Note="+2 Spell Power%{levels.Archmage?\'; costs a 7th-level spell slot to acquire\':\'\'}"',
  'Spell Power +3':
    'Section=magic ' +
    'Note="+2 Spell Power%{levels.Archmage?\'; costs a 9th-level spell slot to acquire\':\'\'}"',

  // Divine Champion
  'Divine Champion Bonus Feats':'Section=feature Note="+%V Fighter feats"',
  'Divine Wrath':
    'Section=combat,save ' +
    'Note=' +
      '"Can gain +3 attacks and damage for %{charismaModifier} rd once per day",' +
      '"Can gain +3 saves and DR 5/- for %{charismaModifier} rd once per day",',
  'Lay On Hands (Divine Champion)':
    'Section=magic ' +
    'Note="Can use touch on followers of %{deity} to heal %{charismaModifier*$\'levels.Divine Champion\'} hit points per day"',
  // Sacred Defense as above
  'Smite Infidel':
    'Section=combat ' +
    'Note="Can gain +%{charismaModifier} attack and inflict +%{$\'levels.Divine Champion\'} HP vs. a follower of a different deity once per day"',

  // Divine Disciple
  'Divine Caster Level Bonus':SRD35.FEATURES['Divine Caster Level Bonus'],
  'Divine Emissary':
    'Section=skill ' +
    'Note="R60\' Can communicate telepathically with %V outsiders and with outsiders who serve %{deity}"',
  'Imbue With Spell Ability':
    'Section=magic ' +
    'Note="Can use <i>Imbue With Spell Ability</i> effects with 1st and 2nd level spells at will" ' +
    'Spells="Imbue With Spell Ability" ' +
    'SpellAbility=Wisdom',
  'New Domain':'Section=feature Note="Can choose an additional deity domain"',
  // Sacred Defense as above
  'Transcendence':
    'Section=magic,save,skill ' +
    'Note=' +
      '"Can a cast a chosen <i>Protection From Chaos/Evil/Good/Law</i> spell on self at will",' +
      '"Affected by spells that target outsiders, not humanoids",' +
      '"+2 Charisma checks with followers of %{deity}" ' +
    'Spells="Protection From Chaos","Protection From Evil","Protection From Good","Protection From Law" ' +
    'SpellAbility=Wisdom',

  // Divine Seeker
  'Divine Perseverance':
    'Section=combat ' +
    'Note="Immediately recovers 1d8+5 hit points when at negative hit points once per day"',
  'Locate Creature':
    'Section=magic ' +
    'Note="Can use <i>Locate Creature</i> effects once per day" ' +
    'Spells="Locate Creature" ' +
    'SpellAbility=Charisma',
  'Locate Object':
    'Section=magic ' +
    'Note="Can use <i>Locate Object</i> effects once per day" ' +
    'Spells="Locate Object" ' +
    'SpellAbility=Charisma',
  'Obscure Object':
    'Section=magic ' +
    'Note="Can use <i>Obscure Object</i> effects once per day" ' +
    'Spells="Obscure Object" ' +
    'SpellAbility=Charisma',
  // Sacred Defense as above
  'Sanctuary':
    'Section=magic ' +
    'Note="Can use <i>Sanctuary</i> effects on self once per day" ' +
    'Spells=Sanctuary ' +
    'SpellAbility=Charisma',
  'Sneak Attack':SRD35.FEATURES['Sneak Attack'],
  'Thwart Glyph':
    'Section=skill ' +
    'Note="+4 Search and Disable Device to locate, bypass, and disable glyphs, runes, and symbols"',

  // Guild Thief
  // 3.0 Innuendo => 3.5 Bluff
  'Doublespeak':'Section=skill Note="+2 Bluff/+2 Diplomacy"',
  'Guild Thief Bonus Feats':'Section=feature Note="%V Guild Thief Feats"',
  'Improved Uncanny Dodge':SRD35.FEATURES['Improved Uncanny Dodge'],
  // Sneak Attack as above
  'Reputation':'Section=feature Note="+%V Leadership"',
  'Uncanny Dodge':SRD35.FEATURES['Uncanny Dodge'],

  // Harper Scout
  'Bardic Knowledge':SRD35.FEATURES['Bardic Knowledge'],
  'Craft Harper Item':
    'Section=magic ' +
    'Note="Can create magic instruments, Harper pins, and potions"',
  "Deneir's Eye":'Section=save Note="+2 vs. glyphs, runes, and symbols"',
  'Favored Enemy':SRD35.FEATURES['Favored Enemy'],
  'Harper Skill Focus':
    'Section=feature ' +
    // TODO: what about randomizing this?
    'Note="+2 General Feat (Skill Focus in a chosen Perform and a Harper class skill)"',
  "Lliira's Heart":'Section=save Note="+2 vs. compulsion and fear"',
  "Tymora's Smile":'Section=save Note="Can add +2 to a save once per day"',

  // Hathran
  'Caster Level Bonus':SRD35.FEATURES['Caster Level Bonus'],
  'Circle Leader':
    'Section=magic ' +
    'Note="1 hr ritual with 2-5 other members raises caster level and gives metamagic feats"',
  'Cohort':'Section=feature Note="Has an Ethran or barbarian follower"',
  'Fear':
    'Section=magic ' +
    'Note="Can cast <i>Fear</i> %{levels.Hathran>5?levels.Hathran//3+\' times\':\'once\'} per day" ' +
    'Spells=Fear ' +
    'SpellAbility=Charisma',
  'Greater Command':
    'Section=magic ' +
    'Note="Can cast a quickened <i>Greater Command</i> once per day" ' +
    'Spells="Greater Command" ' +
    'SpellAbility=Charisma',
  'Place Magic':
    'Section=magic ' +
    'Note="When in Rashemen, can use a full-round action to cast a spell without preparation"',

  // Hierophant
  'Blast Infidel':
    SRD35.FEATURES['Blast Infidel']
    .replace('an opposed alignment', 'a different deity'),
  'Divine Power Bonus':SRD35.FEATURES['Divine Power Bonus'],
  'Divine Reach':SRD35.FEATURES['Divine Reach'],
  'Faith Healing':
    SRD35.FEATURES['Faith Healing']
    .replace('with the same alignment', 'who follow %{deity}'),
  'Gift Of The Divine':
    SRD35.FEATURES['Gift Of The Divine']
    .replace('1-7', '24 hr to 10'),
  'Hierophant Special Abilities':'Section=feature Note="%V selections"',
  'Mastery Of Energy':SRD35.FEATURES['Mastery Of Energy'],
  'Metamagic Feat':SRD35.FEATURES['Metamagic Feat'],
  'Power Of Nature':
    SRD35.FEATURES['Power Of Nature']
    .replace('1-7', '24 hr to 10'),
  // Spell Power as above
  // Spell-Like Ability as above

  // Purple Dragon Knight
  // Fear as above
  'Final Stand':
    'Section=combat ' +
    'Note="R10\' Can give %{$\'levels.Purple Dragon Knight\'+charismaModifier} allies 2d10 temporary hit points for %{$\'levels.Purple Dragon Knight\'+charismaModifier} rd once per day"',
  'Heroic Shield':
    'Section=combat ' +
    'Note="Can use Aid Another to distract a foe, giving an ally +4 Armor Class against that foe\'s next attack"',
  'Inspire Courage (Purple Dragon Knight)':
    'Section=combat ' +
    'Note="Can use a speech to give allies +1 attacks, +1 damage, and +2 charm and fear saves, lasting for 5 rd after the speech ends, %{$\'levels.Purple Dragon Knight\'>3?\'2 times\':\'once\'} per day"',
  'Oath Of Wrath':
    'Section=combat ' +
    'Note="Can gain +2 attacks, damage, saves, and skill checks vs. a chosen foe until the encounter ends once per day"',
  'Rallying Cry':
    'Section=combat ' +
    'Note="R60\' Can give allies +1 on the next attack and +5 Speed for 1 rd 3 times per day"',

  // Red Wizard
  // Arcane Caster Level Bonus as above
  // Circle Leader as above
  'Enhanced Specialization':
    'Section=magic Note="Has an additional opposition school"',
  'Great Circle Leader':
    'Section=magic Note="Leads a magic circle with 9 other members"',
  'Red Wizard Bonus Feats':'Section=feature Note="+1 Wizard Feat"',
  'Specialist Defense':
    'Section=save ' +
    'Note="+%{($\'levels.Red Wizard\'+1)//2-($\'levels.Red Wizard\'>=5?1:0)} saves vs. %{redWizardSpecialistSchool||\'specialist school\'} spells"',
  // Spell Power as above
  'Scribe Tattoo':'Section=magic Note="Can induct novices into circle"',

  // Runecaster
  // Divine Caster Level Bonus as above
  'Improved Runecasting':
    'Section=magic Note="Can add charges to runes%{levels.Runecaster>7?\', make them permanent, \':\'\'} or have them trigger when read or passed"',
  'Maximize Rune':
    'Section=magic ' +
    'Note="Successful +5 DC Craft when creating a rune maximizes its effects"',
  'Rune Chant':
    'Section=magic ' +
    'Note="Can use a full-round action when casting a divine spell to add +3 to its DC and to checks to overcome target SR"',
  'Rune Craft':
    'Section=skill ' +
    'Note="+%{(levels.Runecaster+2)//3<?3} Craft to inscribe runes"',
  'Rune Power':
    'Section=magic ' +
    'Note="+%{levels.Runecaster>=9?3:levels.Runecaster>=5?2:1} to the DC to erase, disable, or dispel runes and to checks to overcome target SR"',

  // Shadow Adept
  // Caster Level Bonus as above
  'Darkvision':SRD35.FEATURES.Darkvision,
  'Greater Shield Of Shadows':
    'Section=magic Note="Has increased Shield Of Shadows effects"',
  'Low-Light Vision':SRD35.FEATURES['Low-Light Vision'],
  // Spell Power as above
  'Shadow Adept Bonus Feats':'Section=feature Note="+1 Metamagic Feat"',
  'Shadow Defense':
    'Section=save ' +
    'Note="+%{($\'levels.Shadow Adept\'+1)//3} vs. enchantment, illusion, necromancy, and darkness spells"',
  'Shadow Double':
    'Section=magic ' +
    'Note="Can create an obedient clone lasting %{casterLevel} rd once per day"',
  'Shadow Feats':
    'Section=feature ' +
    'Note="Has the Insidious Magic, Pernicious Magic, and Tenacious Magic features"',
  'Shadow Walk':
    'Section=magic ' +
    'Note="Can travel quickly via the Plane of Shadow for %{$\'levels.Shadow Adept\'} hr"',
  'Shield Of Shadows':
    'Section=magic ' +
    'Note="Can use <i>Shield</i> effects, gaining 75% concealment%{magicNotes.greaterShieldOfShadows?\' and SR \'+($\'levels.Shadow Adept\'+12):\'\'}, %{casterLevel} rd per dy" ' +
    'Spells=Shield ' +
    'SpellAbility=Charisma',
  // Spell Power as above

  // Domain

  // Cavern
  'Cavern Stonecunning':SRD35.FEATURES.Stonecunning,

  // Charm
  'Charisma Boost':
    'Section=ability Note="Can gain +4 charisma for 1 min once per day"',

  // Craft
  'Crafter':
    'Section=magic,feature ' +
    'Note=' +
      '"+1 caster level on creation spells",' +
      '"+1 General Feat (Skill Focus with a chosen Craft)"',

  // Family
  'Protector':
    'Section=magic ' +
    'Note="R10\' Can give %{charismaModifier>1?charismaModifier+\' targets\':\'a target\'} +4 Armor Class for %{level} rd once per day"',

  // Gnome
  'Advanced Illusionist':
    'Section=magic Note="+1 caster level on Illusion spells"',

  // Halfling
  'Sprightly':
    'Section=skill ' +
    'Note="Can gain +%{charismaModifier} Climb, Hide, Jump, and Move Silently for 10 min once per day"',

  // Hatred
  'Mark Foe':
    'Section=combat ' +
    'Note="Can gain +2 attacks, Armor Class, and saves vs. a chosen foe for 1 min once per day"',

  // Illusion
  // Advanced Illusionist as above

  // Mentalism
  'Mental Ward':
    'Section=magic ' +
    'Note="Touch gives target +%{level+2} on its next Will save within 1 hr once per day"',

  // Metal
  'Hammer Specialist':
    'Section=feature ' +
    'Note="+2 General Feat (Weapon Proficiency and Focus with a chosen type of hammer)"',

  // Moon
  'Turn Lycanthropes':
    'Section=combat ' +
    'Note="Can turn lycanthropes %{charismaModifier+3} times per day"',

  // Nobility
  'Inspire Allies':
    'Section=magic ' +
    'Note="Can give allies within hearing +2 attacks, damage, saves, skill checks, and ability rolls for %{charismaModifier>?1} rd once per day"',

  // Ocean
  'Water Breathing':
    'Section=ability Note="Can breathe water for %{level*10} rd per day"',

  // Orc
  'Smite Power':
    'Section=combat ' +
    'Note="Can gain +%{levels.Cleric} damage, and +4 attack if the target is a dwarf or elf, on an attack once per day"',

  // Portal
  'Detect Portal':
    'Section=skill ' +
    'Note="Can detect active and inactive portals as if they were secret doors"',

  // Renewal
  'Spontaneous Recovery':
    'Section=combat ' +
    'Note="Immediately recovers 1d8+%{charismaModifier} hit points when at negative hit points once per day"',

  // Retribution
  'Strike Of Vengeance':
    'Section=combat ' +
    'Note="Once per day, can inflict maximum damage with a successful first attack during the rd after taking damage from the target"',

  // Scalykind
  'Rebuke Reptiles':
    'Section=combat ' +
    'Note="Can rebuke or command reptiles %{charismaModifier+3} times per day"',

  // Slime
  'Rebuke Oozes':
    'Section=combat ' +
    'Note="Can rebuke or command oozes %{charismaModifier+3} times per day"',

  // Spell
  'Skilled Caster':'Section=skill Note="+2 Concentration/+2 Spellcraft"',

  // Spider
  'Rebuke Spiders':
    'Section=combat ' +
    'Note="Can rebuke or command spiders %{charismaModifier+3} times per day"',

  // Storm
  'Stormfriend':'Section=save Note="Has resistance 5 to electricity"',

  // Suffering
  'Pain Touch':
    'Section=combat ' +
    'Note="Touch attack inflicts -2 Strength and Dexterity for 1 min once per day"',

  // Trade
  'Uncover Trade Secrets':
    'Section=magic ' +
    'Note="Can use <i>Detect Thoughts</i> effects on 1 target for %{charismaModifier} min once per day" ' +
    'Spells="Detect Thoughts" ' +
    'SpellAbility=Wisdom',

  // Tyranny
  'Domineering Magic':'Section=magic Note="+2 DC on compulsion spells"'

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
Realms.CLASS_FEATURES_ADDED = {
  'Cleric':
    'Features=' +
      '"features.Cavern Domain ? 1:Cavern Stonecunning",' +
      '"features.Charm Domain ? 1:Charisma Boost",' +
      '"features.Craft Domain ? 1:Crafter",' +
      '"features.Darkness Domain ? 1:Blind-Fight",' +
      '"features.Drow Domain ? 1:Lightning Reflexes",' +
      '"features.Dwarf Domain ? 1:Great Fortitude",' +
      '"features.Elf Domain ? 1:Point-Blank Shot",' +
      '"features.Family Domain ? 1:Protector",' +
      '"features.Fate Domain ? 1:Uncanny Dodge",' +
      '"features.Gnome || features.Illusion Domain ? 1:Advanced Illusionist",' +
      '"features.Halfling Domain ? 1:Sprightly",' +
      '"features.Hatred Domain ? 1:Mark Foe",' +
      // Handled above '"features.Illusion Domain ? 1:Advanced Illusionist",' +
      '"features.Mentalism Domain ? 1:Mental Ward",' +
      '"features.Metal Domain ? 1:Hammer Specialist",' +
      '"features.Moon Domain ? 1:Turn Lycanthropes",' +
      '"features.Nobility Domain ? 1:Inspire Allies",' +
      '"features.Ocean Domain ? 1:Water Breathing",' +
      '"features.Orc Domain ? 1:Smite Power",' +
      '"features.Planning Domain ? 1:Extend Spell",' +
      '"features.Portal Domain ? 1:Detect Portal",' +
      '"features.Renewal Domain ? 1:Spontaneous Recovery",' +
      '"features.Retribution Domain ? 1:Strike Of Vengeance",' +
      '"features.Rune Domain ? 1:Scribe Scroll",' +
      '"features.Scalykind Domain ? 1:Rebuke Reptiles",' +
      '"features.Slime Domain ? 1:Rebuke Oozes",' +
      '"features.Spell Domain ? 1:Skilled Caster",' +
      '"features.Spider Domain ? 1:Rebuke Spiders",' +
      '"features.Storm Domain ? 1:Stormfriend",' +
      '"features.Suffering Domain ? 1:Pain Touch",' +
      '"features.Time Domain ? 1:Improved Initiative",' +
      '"features.Trade Domain ? 1:Uncover Trade Secrets",' +
      '"features.Tyranny Domain ? 1:Domineering Magic",' +
      '"features.Undeath Domain ? 1:Extra Turning" ' +
    'Selectables=' +
      '"deityDomains =~ \'Cavern\' ? 1:Cavern Domain:Domain",' +
      '"deityDomains =~ \'Charm\' ? 1:Charm Domain:Domain",' +
      '"deityDomains =~ \'Craft\' ? 1:Craft Domain:Domain",' +
      '"deityDomains =~ \'Darkness\' ? 1:Darkness Domain:Domain",' +
      '"deityDomains =~ \'Drow\' ? 1:Drow Domain:Domain",' +
      '"deityDomains =~ \'Dwarf\' ? 1:Dwarf Domain:Domain",' +
      '"deityDomains =~ \'Elf\' ? 1:Elf Domain:Domain",' +
      '"deityDomains =~ \'Family\' ? 1:Family Domain:Domain",' +
      '"deityDomains =~ \'Fate\' ? 1:Fate Domain:Domain",' +
      '"deityDomains =~ \'Gnome\' ? 1:Gnome Domain:Domain",' +
      '"deityDomains =~ \'Halfling\' ? 1:Halfling Domain:Domain",' +
      '"deityDomains =~ \'Hatred\' ? 1:Hatred Domain:Domain",' +
      '"deityDomains =~ \'Illusion\' ? 1:Illusion Domain:Domain",' +
      '"deityDomains =~ \'Mentalism\' ? 1:Mentalism Domain:Domain",' +
      '"deityDomains =~ \'Metal\' ? 1:Metal Domain:Domain",' +
      '"deityDomains =~ \'Moon\' ? 1:Moon Domain:Domain",' +
      '"deityDomains =~ \'Nobility\' ? 1:Nobility Domain:Domain",' +
      '"deityDomains =~ \'Ocean\' ? 1:Ocean Domain:Domain",' +
      '"deityDomains =~ \'Orc\' ? 1:Orc Domain:Domain",' +
      '"deityDomains =~ \'Planning\' ? 1:Planning Domain:Domain",' +
      '"deityDomains =~ \'Portal\' ? 1:Portal Domain:Domain",' +
      '"deityDomains =~ \'Renewal\' ? 1:Renewal Domain:Domain",' +
      '"deityDomains =~ \'Retribution\' ? 1:Retribution Domain:Domain",' +
      '"deityDomains =~ \'Rune\' ? 1:Rune Domain:Domain",' +
      '"deityDomains =~ \'Scalykind\' ? 1:Scalykind Domain:Domain",' +
      '"deityDomains =~ \'Slime\' ? 1:Slime Domain:Domain",' +
      '"deityDomains =~ \'Spell\' ? 1:Spell Domain:Domain",' +
      '"deityDomains =~ \'Spider\' ? 1:Spider Domain:Domain",' +
      '"deityDomains =~ \'Storm\' ? 1:Storm Domain:Domain",' +
      '"deityDomains =~ \'Suffering\' ? 1:Suffering Domain:Domain",' +
      '"deityDomains =~ \'Time\' ? 1:Time Domain:Domain",' +
      '"deityDomains =~ \'Trade\' ? 1:Trade Domain:Domain",' +
      '"deityDomains =~ \'Tyranny\' ? 1:Tyranny Domain:Domain",' +
      '"deityDomains =~ \'Undeath\' ? 1:Undeath Domain:Domain"'
};
Realms.DEITIES = {

  'None':'',

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
    SRD35.RACES.Dwarf
      .replace('Dwarf Ability', 'Gold Dwarf Ability')
      .replace('Dwarf Enmity', 'Gold Dwarf Enmity'),
  'Gray Dwarf':
    SRD35.RACES.Dwarf
      .replace('Common', 'Undercommon')
      .replace('Dwarf Ability Adjustment', 'Gray Dwarf Ability Adjustment')
      .replace(/['"]?Darkvision['"]?/, '"Extended Darkvision"')
      .replace('Features=', 'Features="Keen Senses (Gray Dwarf)","Gray Dwarf Immunities","Light Sensitivity","Racial Level Adjustment","Stealthy Movement",'),
  'Shield Dwarf': SRD35.RACES.Dwarf,
  'Drow Elf':
    SRD35.RACES.Elf
      .replace('Common', 'Undercommon')
      .replace('Elf Ability Adjustment', 'Drow Elf Ability Adjustment')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace(/Weapon Proficiency[^'"]*/, 'Weapon Proficiency (Hand Crossbow/Light Crossbow/Rapier/Shortsword)')
      .replace('Features=', 'Features="Drow Elf Spell Resistance","Light Blindness","Light Sensitivity","Racial Level Adjustment","Defy Spells",'),
  'Moon Elf': SRD35.RACES.Elf,
  'Sun Elf': SRD35.RACES.Elf.replace('Elf Ability', 'Sun Elf Ability'),
  'Wild Elf': SRD35.RACES.Elf.replace('Elf Ability', 'Wild Elf Ability'),
  'Wood Elf': SRD35.RACES.Elf.replace('Elf Ability', 'Wood Elf Ability'),
  'Deep Gnome':
    SRD35.RACES.Gnome
      .replace('Common', 'Undercommon')
      .replace('Gnome Ability Adjustment', 'Deep Gnome Ability Adjustment')
      .replace('Dodge Giants', 'Exceptional Dodger')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace('Features=', 'Features="Resilient","Racial Level Adjustment",Inconspicuous,Stonecunning,"Deep Gnome Magic","Deep Gnome Spell Resistance",'),
  'Rock Gnome': SRD35.RACES.Gnome,
  'Half-Elf': SRD35.RACES['Half-Elf'],
  'Half-Orc': SRD35.RACES['Half-Orc'],
  'Ghostwise Halfling':
    SRD35.RACES.Halfling
      .replace('Fortunate', '"Speak Without Sound"'),
  'Lightfoot Halfling': SRD35.RACES.Halfling,
  'Strongheart Halfling':
    SRD35.RACES.Halfling
      .replace('Fortunate', '"Bonus Feat (Strongheart Halfling)"'),
  'Human': SRD35.RACES.Human,
  'Aasimar':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Aasimar Ability Adjustment","1:Aasimar Alertness",' +
      '"1:Aasimar Magic","1:Aasimar Resistance","1:Darkvision","1:Outsider",' +
      '"1:Racial Level Adjustment" ' +
    'Languages=Common',
  'Air Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Air Genasi Ability Adjustment","1:Air Genasi Magic",' +
      '"1:Breathless","1:Darkvision","1:Genasi Resistance","1:Outsider",' +
      '"1:Racial Level Adjustment",' +
      '"levels.Cleric ? 1:Clerical Focus" ' +
    'Languages=Common',
  'Earth Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Earth Genasi Ability Adjustment",' +
      '"1:Earth Genasi Magic","1:Genasi Resistance","1:Outsider",' +
      '"1:Racial Level Adjustment",' +
      '"levels.Cleric ? 1:Clerical Focus" ' +
    'Languages=Common',
  'Fire Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Control Flame","1:Darkvision","1:Fire Genasi Ability Adjustment",' +
      '"1:Genasi Resistance","1:Outsider","1:Racial Level Adjustment",' +
      '"levels.Cleric ? 1:Clerical Focus" ' +
    'Languages=Common',
  'Water Genasi':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Amphibious","1:Darkvision","1:Genasi Resistance",' +
      '"1:Natural Swimmer","1:Outsider","1:Racial Level Adjustment",' +
      '"1:Water Genasi Ability Adjustment","1:Water Genasi Magic",' +
      '"levels.Cleric ? 1:Clerical Focus" ' +
    'Languages=Common',
  'Tiefling':
    'Size=Medium ' +
    'Speed=30 ' +
    'Features=' +
      '"1:Darkvision","1:Outsider","1:Racial Level Adjustment","1:Sneaky",' +
      '"1:Tiefling Ability Adjustment","1:Tiefling Magic",' +
      '"1:Tiefling Resistance" ' +
    'Languages=Common'
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

  // NOTE: It's unclear which of these spells might be available in potion/oil
  // form. The source book mentions Potion of Shadow Mask, along with a number
  // of potions that appear not to be spell-based: Hiding, Sneaking, Charisma,
  // Vision, Truth, and Love
  "Aganazzar's Scorcher":
    'School=Evocation ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"5\'x%{lvl//2*5+25}\' line inflicts %{lvl//2<?5}d8 HP fire (save Reflex half)"',
  'Analyze Portal':
    'School=Divination ' +
    'Level=B3,Portal2,S3,W3 ' +
    'Description=' +
      '"R60\' Reveals the location and properties of portals in a quarter circle for concentration up to %{lvl} rd; reveals one property per rd, and each property requires a DC 17 caster level check to uncover"',
  'Anyspell':
    'School=Transmutation ' +
    'Level=Spell3 ' +
    'Description=' +
      '"Allows preparing an arcane spell of up to 2nd level from a written source; the prepared spell occupies the level 3 domain spell slot"',
  'Armor Of Darkness':
    'School=Abjuration ' +
    'Level=Darkness4 ' +
    'Description=' +
      '"Touched gains a +%{3+lvl//4<?8} deflection bonus to Armor Class, 60\' darkvision, and +2 saves vs. holy, good, and light spells for %{lvl*10} min; an undead target also gains +4 turn resistance"',
  'Blacklight':
    'School=Evocation ' +
    'Level=Darkness3,S3,W3 ' +
    'Description=' +
      '"R%{lvl//2*5+25}\' 20\' radius around the target becomes enveloped in darkness (save Will negates) for %{lvl} rd; the darkness is impervious to Darkvision, but self can see normally when inside the radius"',
  'Claws Of Darkness':
    'School=Illusion ' +
   'Level=S2,W2 ' +
   'Description=' +
     '"Self grows 6\' extendable claws that inflict 1d4 HP cold via unarmed strikes and grappling for %{lvl} rd; grappling also slows the target (save Fortitude negates)"',
  'Cloak Of Dark Power':
    'School=Abjuration ' +
    'Level=Drow1 ' +
    'Description=' +
      '"Gives touched protection from the effects of sunlight and +4 saves vs. light and darkness effects for %{lvl} min"',
  'Create Magic Tattoo':
    'School=Conjuration ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"Inscribes on touched a tattoo that grants a choice of these benefits for 1 day, with at most 3 tattoos inscribed on a target at any time: a +2 bonus to a chosen type of saves; +1 attacks; a +1 deflection bonus to Armor Class%{lvl>6?\'; a +2 resistance bonus to saves; +2 attacks; the ability to recall a cast spell of up to 2nd level once during the day\':\'\'}%{lvl>12?\'; SR \'+(10+lvl//6)+\'; +2 to a choice of ability; +1 caster level for spell effects\':\'\'}"',
  'Darkbolt':
    'School=Evocation ' +
    'Level=Darkness5 ' +
    'Description=' +
      '"R%{lvl*10+100}\' Ranged touch attacks with ${lvl//2<?7} bolts in a 30\' radius each inflict 2d8 HP and dazed for 1 rd (save Will HP only); the spell does not damage undead, but may daze them"',
  "Eagle's Splendor":
    SRD35.SPELLS["Eagle's Splendor"]
    .replace('+4', '+1d4+1')
    .replace(' min', ' hr'),
  "Elminster's Evasion":
    'School=Evocation ' +
    'Level=S9,W9 ' +
    'Description=' +
      '"Specifies a set of triggers that will teleport self and up to 50 lb of touched objects to a named locale, upon which up to 2 additional spells of up to level %{lvl//3<?6} with self as the target will take effect"',
  'Fantastic Machine':
    'School=Illusion ' +
    'Level=Craft6,Gnome6 ' +
    'Description=' +
      '"Creates an illusory large machine (22 hit points; Armor Class 14; slam +5 1d8+4, x3 vs. stone or metal; throw rocks +3 2d6+4; move 40\'; swim and fly 10\'; load 230) to perform a specified task for %{lvl} min"',
  'Fire Stride':
    'School=Transmutation ' +
    'Level=S4,W4 ' +
    'Description=' +
      '"Allows self to teleport %{lvl*40+400}\' between fires %{lvl} times within %{lvl*10} min"',
  'Flashburst':
    'School=Evocation ' +
    'Level=S3,W3 ' +
    'Description=' +
      '"R%{lvl*40+400}\' Inflicts blinded (50% miss chance on attacks; foe attacks gain +2 to hit; loss of Dexterity bonus to Armor Class; move at half Speed; -4 on Dexterity and Strength skill checks) for 2d8 rd on creatures in a 120\' radius (save Will inflicts dazzled for 1 rd on creatures in a 20\' radius; otherwise negates)"',
  'Flensing':
    'School=Evocation ' +
    'Level=S8,W8 ' +
    'Description=' +
      '"R%{lvl//2*5+25}\' Inflicts 2d6 HP and -1d6 Charisma and Constitution per rd (save Fortitude each rd inflicts half HP only) for 4 rd"',
  'Gate Seal':
    'School=Abjuration ' +
    'Level=B6,C6,D6,S6,W6 ' +
    'Description=' +
      '"R%{lvl//2*5+25}\' Disables a magical gate or portal; a successful <i>Dispel Magic</i> or use of a <i>chime of opening</i> ends"',
  'Gembomb':
    'School=Conjuration ' +
    'Level=Gnome2,Trade2 ' +
    'Description=' +
      '"Changes up to 5 gems into R100\' ranged touch bombs that together inflict ${lvl//2<?5}d8 HP force (save Reflex half), divided among them as desired"',
  'Great Shout':
    'School=Evocation ' +
    'Level=B6,S8,W8 ' +
    'Description=' +
      '"5\'x%{lvl//2*5+25}\' area inflicts on objects 20d6 HP sonic (save Reflex for held objects negates), and a %{lvl//2*5+25}\' cone inflicts on creatures 10d6 HP sonic (or %{lvl<?20}d6 HP for crystalline creatures), stunned for 1 rd, and deafened for 4d6 rd (save Fortitude half HP and deafness duration)"',
  'Greater Anyspell':
    'School=Transmutation ' +
    'Level=Spell6 ' +
    'Description=' +
      '"Allows preparing an arcane spell of up to 5th level from a written source; the prepared spell occupies the level 6 domain spell slot"',
  'Greater Fantastic Machine':
    'School=Illusion ' +
    'Level=Craft9 ' +
    'Description=' +
      '"Creates an illusory large machine (88 hit points; Armor Class 20; slam +17/+12 1d8+9, x3 vs. stone and metal; throw rocks +12/+7 2d6+9; move 60\'; swim and fly 20\'; load 520) that obeys instructions for %{lvl} min"',
  "Grimwald's Graymantle":
    'School=Necromancy ' +
    'Level=S5,W5 ' +
    'Description=' +
      '"R%{lvl*10+100}\' Ranged touch prevents the target from healing, restoring, and regenerating (save Fortitude negates) for %{lvl} rd"',
  'Lesser Ironguard':
    'School=Abjuration ' +
    'Level=S5,W5 ' +
    'Description=' +
      '"Causes nonmagical metal to pass harmlessly through touched for %{lvl} rd"',
  'Maelstrom':
    'School=Conjuration ' +
    'Level=Ocean8 ' +
    'Description=' +
      '"R%{lvl*40+400}\' Creates a 60\' radius, 60\' deep whirlpool that inflicts 3d8 HP bludgeoning for 2d4 rd (save Reflex or Swim for swimmers and Profession (Sailor) for vessels negates) for %{lvl} rd"',
  'Maw Of Stone':
    'School=Transmutation ' +
    'Level=Cavern7 ' +
    'Description=' +
      '"Causes a natural opening or chamber to make +%{lvl+wisdomModifier+7} grapple attempts when triggered for %{lvl*10} min; successful grapples are followed by a 2nd attempt that inflicts 2d6+10 HP if successful; openings can attempt to grapple 1 target each rd, chambers can grapple all creatures within, and openings and chambers with a dimension greater than 8\' suffer -1 on the initial grapple attempt, gain +4 on the 2nd, and inflict 2d8+10 HP"',
  'Moon Blade':
    'School=Evocation ' +
    'Level=Moon3,S3,W3 ' + // W3 for Hathran
    'Description=' +
      '"Creates a 3\' beam of light, wielded as a choice of sword, that allows melee touch attacks inflicting 1d8+%{lvl//2} HP (or 2d8+%{lvl} HP to undead), for %{lvl} min; a creature struck by the blade also requires a successful Concentration attempt to cast spells or use spell-like abilities on its next turn"',
  'Moon Path':
    'School=Evocation ' +
    'Level=Moon5,S5,W5 ' + // W5 for Hathran
    'Description=' +
      '"Creates a glowing pathway 5\'-20\' wide and %{lvl*15}\' long for %{lvl} min; it provides <i>Sanctuary</i> and <i>Spider Climb</i> effects for %{lvl} designed creatures when in contact"',
  'Moonbeam':
    'School=Evocation ' +
    'Level=Moon2,S2,W2 ' + // W2 for Hathran
    'Description=' +
      '"R%{lvl//2*5+25}\' Creates a beam for %{lvl} min that forces target lycanthropes to assume animal form (save Will negates for 24 hr)"',
  'Moonfire':
    'School=Evocation ' +
    'Level=Moon9 ' +
    'Description=' +
      '"R%{lvl//2*5+25}\' Cone inflicts %{lvl//2<?10}d8 HP (or double this for undead and shapechangers) (save Reflex half), reverts changed creatures to normal form (save Will negates), and causes the area to glow, marks auras, and requires successful caster level checks to create or continue electricity effects for %{lvl} rd"',
  'Scatterspray':
    'School=Transmutation ' +
    'Level=Harper1,S1,W1 ' +
    'Description=' +
      '"R%{lvl//2*5+25}\' Unsecured little items in a 1\' radius scatter, inflicting 1d8 HP on creatures within 10\' (save Reflex negates)"',
  'Shadow Mask':
    'School=Illusion ' +
    'Level=Harper2,S2,W2 ' +
    'Description=' +
      '"Shrouds self facial features and gives +4 saves vs. light and darkness spells and 50% protection from gaze attacks for %{lvl*10} min" ' +
    'Liquid=Potion',
  'Shadow Spray':
    'School=Illusion ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"R%{lvl*10+100}\' 5\' radius inflicts dazed for 1 rd, -2 fear saves for %{lvl} rd, and -2 temporary Strength damage (save Fort negates)"',
  "Snilloc's Snowball Swarm":
    'School=Evocation ' +
    'Level=S2,W2 ' +
    'Description=' +
      '"R%{lvl*10+100}\' 10\' radius inflicts %{(lvl+1)//2<?5}d6 HP cold (save Reflex half)"',
  'Spider Curse':
    'School=Transmutation ' +
    'Level=Spider6 ' +
    'Description=' +
      '"R%{lvl*10+100}\' Polymorphs the target into a drider (save Will negates) that obeys telepathic commands for %{lvl} days; the target gains +4 Strength, Dexterity, and Constitution and a poison bite attack that inflicts 1d6 points of initial and secondary temporary Strength damage (save Fortitude DC %{16+wisdomModifier} negates)"',
  'Spider Shapes':
    'School=Transmutation ' +
    'Level=Spider9 ' +
    'Description=' +
      '"R%{lvl//2*5+25}\' Polymorphs %{lvl} willing targets into monstrous spiders for %{lvl} hr or until each ends the effect; the transformation inflicts no disorientation and restores hit points equivalent to a day\'s rest"',
  'Spiderform':
    'School=Transmutation ' +
    'Level=Drow5 ' +
    'Description=' +
      '"Polymorphs self into a drider or monstrous spider with a poisonous bite for %{lvl} hr; the transformation inflicts no disorientation and restores hit points equivalent to a day\'s rest"',
  'Stone Spiders':
    'School=Transmutation ' +
    'Level=Spider7 ' +
    'Description=' +
      '"R%{lvl//2*5+25}\' Transforms 1d3 pebbles into obedient constructs with the form and capabilities of monstrous spiders for %{lvl} rd; the targets also gain +6 natural armor, DR 30/+2, and a poison that inflicts 1d3 points of initial and secondary Strength damage (save Fortitude DC %{17+wisdomModifier} negates); if cast on vermin, the spell instead gives 1d3 targets DR 10/+5 for %{lvl} rd"',
  'Thunderlance':
    'School=Evocation ' +
    'Level=S4,W4 ' +
    'Description=' +
      '"Allows self to wield, with proficiency, a shimmering force staff (+%{lvl//2+1} attack inflicts 2d6+%{lvl//2+1} x3@20) that can grow and shrink between 1\' and 20\' for %{lvl} rd; hits with the staff also allow a caster level check to dispel protective spells of up to level 3"',
  'Waterspout':
    'School=Conjuration ' +
    'Level=Ocean7 ' +
    'Description=' +
      '"R%{lvl*40+400}\' Creates on a body of water a 10\' wide, 80\' waterspout that can be moved 30\' per rd for %{lvl} rd; it inflicts 2d6 HP on creatures it touches (save Reflex negates), and an additional 2d6 HP per rd for 1d3 rd, plus falling damage from being ejected from the waterspout, on Medium and smaller creatures who fail their saves"'

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
  'Blindness/Deafness':'Darkness2',
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
  'Creeping Doom':'Scalykind7,Spider8',
  'Darkness':'Cavern2',
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
  'Enthrall':'Nobility2,Tyranny2',
  'Entropic Shield':'Storm1',
  'Erase':'Harper1,Rune1',
  'Etherealness':'Portal7',
  'Explosive Runes':'Rune4',
  'Eyebite':'Orc6,Scalykind6,Suffering7',
  'Fabricate':'Dwarf5,Trade5',
  'Faerie Fire':'Moon1',
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
  'Invisibility':'Harper2',
  'Iron Body':'Metal8',
  "Irresistible Dance":'Gnome8',
  'Jump':'Harper1',
  'Keen Edge':'Metal3',
  'Knock':'Harper2',
  // 3.0 Random Action => 3.5 Lesser Confusion
  'Lesser Confusion':'Mentalism1',
  'Lesser Planar Binding':'Rune5',
  'Lesser Restoration':'Renewal2',
  'Light':'Harper1',
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
  'Nondetection':'Harper3',
  'Obscuring Mist':'Darkness1',
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
for(let s in Realms.SPELLS_LEVELS) {
  let levels = Realms.SPELLS_LEVELS[s];
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
  'Blade Boot':'Level=Exotic Category=Light Damage=d4 Threat=19',
  'Chakram':'Level=Exotic Category=Ranged Damage=d4 Crit=3 Range=30',
  'Claw Bracer':'Level=Exotic Category=One-Handed Damage=d4 Threat=19',
  'Cutlass':'Level=Martial Category=One-Handed Damage=d6 Threat=19',
  'Halfspear':'Level=Simple Category=Ranged Damage=d6 Crit=3 Range=20',
  'Khopesh':'Level=Exotic Category=One-Handed Damage=d8 Threat=19',
  'Saber':'Level=Martial Category=One-Handed Damage=d8 Threat=19',
  'Maul':'Level=Martial Category=Two-Handed Damage=d10 Crit=3 Threat=20',
  'Scourge':'Level=Exotic Category=One-Handed Damage=d8 Threat=20'
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
  rules, alignments, classes, deities, races, regions, prestigeClasses,
  npcClasses
) {

  QuilvynUtils.checkAttrTable(regions, []);

  if(rules.basePlugin == window.Pathfinder)
    Pathfinder.identityRules(
      rules, alignments, classes, deities, races, Pathfinder.TRACKS,
      Pathfinder.TRAITS, prestigeClasses, npcClasses
    );
  else
    SRD35.identityRules(
      rules, alignments, classes, deities, races, prestigeClasses, npcClasses
    );

  for(let r in regions)
    rules.choiceRules(rules, 'Region', r, regions[r]);

  // Level adjustments for powerful races
  rules.defineRule('abilityNotes.racialLevelAdjustment',
    'race', '=', 'source.match(/Aasimar|Genasi|Tiefling/) ? 1 : source.match(/Drow|Gray Dwarf/) ? 2 : source == "Deep Gnome" ? 3 : null'
  );
  rules.defineRule('level', '', '^', '1');
  rules.defineRule('experienceNeededLevel',
    'level', '=', null,
    'abilityNotes.racialLevelAdjustment', '+', null
  );
  if(rules.basePlugin == window.Pathfinder) {
    for(let track in Pathfinder.TRACKS) {
      let progression =
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
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
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
  else if(type == 'Class' || type == 'Prestige' || type == 'NPC') {
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellsAvailable')
    );
    Realms.classRulesExtra(rules, name);
    if(type == 'Prestige')
      rules.defineRule('levels.' + name, 'prestige.' + name, '=', null);
    else if(type == 'NPC')
      rules.defineRule('levels.' + name, 'npc.' + name, '=', null);
  } else if(type == 'Class Feature') {
    Realms.classFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Class'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
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
      QuilvynUtils.getAttrValue(attrs, 'Speed'),
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
      QuilvynUtils.getAttrValueArray(attrs, 'Note'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility')
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
  else if(type == 'Race') {
    Realms.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'Size'),
      QuilvynUtils.getAttrValue(attrs, 'Speed')
    );
    Realms.raceRulesExtra(rules, name);
  } else if(type == 'Race Feature') {
    Realms.raceFeatureRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValue(attrs, 'Race'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Selectable'),
      QuilvynUtils.getAttrValueArray(attrs, 'Replace')
    );
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
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Skill') {
    let untrained = QuilvynUtils.getAttrValue(attrs, 'Untrained');
    Realms.skillRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'Ability'),
      untrained && !(untrained+'').match(/(^n|false)$/i),
      QuilvynUtils.getAttrValueArray(attrs, 'Class'),
      QuilvynUtils.getAttrValueArray(attrs, 'Synergies')
    );
    if(rules.basePlugin.skillRulesExtra)
      rules.basePlugin.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    let description = QuilvynUtils.getAttrValue(attrs, 'Description');
    let groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    let liquids = QuilvynUtils.getAttrValueArray(attrs, 'Liquid');
    let school = QuilvynUtils.getAttrValue(attrs, 'School');
    let schoolAbbr = (school || 'Universal').substring(0, 4);
    groupLevels.forEach(gl => {
      let matchInfo = (gl + '').match(/^(\D+)(\d+)$/);
      if(!matchInfo) {
        console.log('Bad level "' + gl + '" for spell ' + name);
      } else {
        let group = matchInfo[1];
        let level = matchInfo[2] * 1;
        let fullName = name + '(' + group + level + ' ' + schoolAbbr + ')';
        // If classes have already been processed, then domains will be listed
        // in Cleric selectable features; otherwise, look in SRD35.CLASSES
        let domainSpell =
          (rules.getChoices('selectableFeatures') != null &&
           ('Cleric - ' + group + ' Domain') in rules.getChoices('selectableFeatures')) ||
          Realms.CLASSES.Cleric.includes(group + ' Domain');
        Realms.spellRules
          (rules, fullName, school, group, level, description, domainSpell,
           liquids);
        rules.addChoice('spells', fullName, attrs);
      }
    });
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
      QuilvynUtils.getAttrValue(attrs, 'Range'),
      QuilvynUtils.getAttrValueArray(attrs, 'Properties')
    );
  else {
    console.log('Unknown choice type "' + type + '"');
    return;
  }
  if(type != 'Spell') {
    type = type == 'Class' ? 'levels' :
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
 * #spellSlots# lists the number of spells per level per day granted, and
 * #spellsAvailable# lists the number of spells known at each level.
 */
Realms.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots, spellsAvailable
) {
  if(rules.basePlugin == window.Pathfinder) {
    for(let i = 0; i < requires.length; i++) {
      for(let skill in Pathfinder.SRD35_SKILL_MAP) {
        requires[i] =
          requires[i].replaceAll(skill, Pathfinder.SRD35_SKILL_MAP[skill]);
      }
    }
    for(let i = skills.length - 1; i >= 0; i--) {
      let skill = skills[i];
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
    casterLevelDivine, spellAbility, spellSlots, spellsAvailable
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name# that cannot be
 * derived directly from the attributes passed to classRules.
 */
Realms.classRulesExtra = function(rules, name) {

  let allFeats = rules.getChoices('feats');
  let classLevel = 'levels.' + name;
  let feats = null;

  if(name == 'Arcane Devotee') {

    if(allFeats == null)
      console.log('No feats defined for class "' + name + '"');
    else
      feats = [
        'Greater Spell Penetration', 'Improved Counterspell',
        'Magical Artisan', 'Shadow Weave Magic', 'Spell Penetration'
      ].concat(
        QuilvynUtils.getKeys(allFeats).filter(x => x.match(/Spell Focus/) || allFeats[x].match(/Item\s+Creation/))
      );

    // Override featureRules' + with +=
    rules.defineRule('featCount.Arcane Devotee',
      'featureNotes.arcaneDevoteeBonusFeats', '+=', null
    );
    rules.defineRule('featureNotes.arcaneDevoteeBonusFeats',
      classLevel, '=', 'Math.floor(source / 3)'
    );
    rules.defineRule
      ('magicNotes.arcaneCasterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('saveNotes.sacredDefense', classLevel, '+=', 'Math.floor(source / 2)');

  } else if(name == 'Archmage') {

    // Copied and modified from SRD35
    let allSpells = rules.getChoices('spells');
    let matchInfo;
    for(let s in allSpells) {
      if((matchInfo = s.match(/\(\w+5 (\w+)\)/)) != null) {
        let school = matchInfo[1];
        rules.defineRule
          ('level5' + school + 'Spells', 'spells.' + s, '+=', '1');
        rules.defineRule
          ('level5SpellSchools', 'level5' + school + 'Spells', '+=', '1');
      }
    }

    rules.defineRule('featureNotes.highArcana', classLevel, '=', null);
    rules.defineRule
      ('magicNotes.arcaneCasterLevelBonus', classLevel, '+=', null);
    //rules.defineRule N/A for this rule set
    //  ('magicNotes.spellPower', 'archmageFeatures.Spell Power', '+=', null);
    rules.defineRule('selectableFeatureCount.Archmage (High Arcana)',
      'featureNotes.highArcana', '+=', null
    );
    //rules.defineRule N/A for this rule set
    // ('spellEffectsCasterLevelBonus', 'magicNotes.spellPower', '+=', null);

    rules.defineRule('spellSlots.S5',
      // 'archmageFeatures.Spell Power', '+', '-source', N/A for this rule set
      'archmageFeatures.Spell-Like Ability', '+', '-source'
    );
    rules.defineRule('spellSlots.W5',
      // 'archmageFeatures.Spell Power', '+', '-source', N/A for this rule set
      'archmageFeatures.Spell-Like Ability', '+', '-source'
    );
    rules.defineRule
      ('spellSlots.S6', 'archmageFeatures.Mastery Of Shaping', '+', '-source');
    rules.defineRule
      ('spellSlots.W6', 'archmageFeatures.Mastery Of Shaping', '+', '-source');
    rules.defineRule('spellSlots.S7',
      'archmageFeatures.Arcane Reach', '+', '-source',
      'archmageFeatures.Mastery Of Counterspelling', '+', '-source'
    );
    rules.defineRule('spellSlots.W7',
      'archmageFeatures.Arcane Reach', '+', '-source',
      'archmageFeatures.Mastery Of Counterspelling', '+', '-source'
    );
    rules.defineRule
      ('spellSlots.S8', 'archmageFeatures.Mastery Of Elements', '+', '-source');
    rules.defineRule
      ('spellSlots.W8', 'archmageFeatures.Mastery Of Elements', '+', '-source');
    rules.defineRule
      ('spellSlots.S9', 'archmageFeatures.Arcane Fire', '+', '-source');
    rules.defineRule
      ('spellSlots.W9', 'archmageFeatures.Arcane Fire', '+', '-source');

    // additions to SRD35 rules
    rules.defineRule('features.Spell Power',
      'archmageFeatures.Spell Power +1', '=', '1',
      'archmageFeatures.Spell Power +2', '=', '1',
      'archmageFeatures.Spell Power +3', '=', '1'
    );
    rules.defineRule('magicNotes.spellPower',
      'archmageFeatures.Spell Power +1', '+=', '1',
      'archmageFeatures.Spell Power +2', '+=', '2',
      'archmageFeatures.Spell Power +3', '+=', '3'
    );
    rules.defineRule('magicNotes.spellPower.1',
      'archmageFeatures.Spell Power +1', '=', '"arcane"',
      'archmageFeatures.Spell Power +2', '=', '"arcane"',
      'archmageFeatures.Spell Power +3', '=', '"arcane"'
    );
    rules.defineRule('spellSlots.S5',
      'archmageFeatures.Spell Power +1', '+', '-source'
    );
    rules.defineRule('spellSlots.W5',
      'archmageFeatures.Spell Power +1', '+', '-source'
    );
    rules.defineRule('spellSlots.S7',
      'archmageFeatures.Spell Power +2', '+', '-source'
    );
    rules.defineRule('spellSlots.W7',
      'archmageFeatures.Spell Power +2', '+', '-source'
    );
    rules.defineRule('spellSlots.S9',
      'archmageFeatures.Spell Power +3', '+', '-source'
    );
    rules.defineRule('spellSlots.W9',
      'archmageFeatures.Spell Power +3', '+', '-source'
    );

  } else if(name == 'Divine Champion') {

    rules.defineRule('featureNotes.divineChampionBonusFeats',
      classLevel, '=', 'Math.floor(source / 2)'
    );
    rules.defineRule('featCount.Fighter',
      'featureNotes.divineChampionBonusFeats', '+=', null
    );
    rules.defineRule
      ('saveNotes.sacredDefense', classLevel, '+=', 'Math.floor(source / 2)');

  } else if(name == 'Divine Disciple') {

    rules.defineRule('selectableFeatureCount.Cleric (Domain)',
      'featureNotes.newDomain', '+=', '1'
    );
    rules.defineRule
      ('skillNotes.divineEmissary', 'alignment', '=', 'source.toLowerCase()');
    rules.defineRule
      ('magicNotes.divineCasterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('saveNotes.sacredDefense', classLevel, '+=', 'Math.floor(source / 2)');

  } else if(name == 'Divine Seeker') {

    rules.defineRule('casterLevels.Divine Seeker',
      classLevel, '=', null,
      'charismaModifier', '+', null
    );
    rules.defineRule
      ('casterLevels.LocateCreature', 'casterLevels.Divine Seeker', '=', null);
    rules.defineRule
      ('casterLevels.LocateObject', 'casterLevels.Divine Seeker', '=', null);
    rules.defineRule
      ('casterLevels.ObscureObject', 'casterLevels.Divine Seeker', '=', null);
    rules.defineRule
      ('casterLevels.Sanctuary', 'casterLevels.Divine Seeker', '=', null);
    rules.defineRule
      ('combatNotes.sneakAttack', classLevel, '+=', 'Math.floor(source / 2)');
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
    // Override featureRules' + with +=
    rules.defineRule('featCount.Guild Thief',
      'featureNotes.guildThiefBonusFeats', '+=', null
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
      ['Sum \'features.Skill Focus\' >= 2', 'Sum \'features.Skill Focus .Perform\' >= 1']
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

  } else if(name == 'Hierophant') {

    // Copied and modified from SRD35
    rules.defineRule
      ('casterLevelDivine', 'magicNotes.divinePowerBonus', '+', null);
    rules.defineRule('combatNotes.turnUndead.1',
      'combatNotes.masteryOfEnergy', '+', '4'
    );
    rules.defineRule('combatNotes.turnUndead.2',
      'combatNotes.masteryOfEnergy', '+', '4'
    );
    rules.defineRule('magicNotes.divinePowerBonus', classLevel, '+=', null);
    //rules.defineRule N/A for this rule set
    //  ('magicNotes.spellPower', 'hierophantFeatures.Spell Power', '+=', null);
    rules.defineRule('featureNotes.specialAbility(Hierophant)',
      classLevel, '=', null
    );
    rules.defineRule('selectableFeatureCount.Hierophant (Special Ability)',
      'featureNotes.specialAbility(Hierophant)', '=', null
    );
    //rules.defineRule N/A for this rule set
    // ('spellEffectsCasterLevelBonus', 'magicNotes.spellPower', '+=', null);

    // additions to SRD35 rules
    rules.defineRule('features.Spell Power',
      'hierophantFeatures.Spell Power +2', '=', '1'
    );
    rules.defineRule('magicNotes.spellPower',
      'hierophantFeatures.Spell Power +2', '+=', 'source * 2'
    );
    rules.defineRule('magicNotes.spellPower.1',
      'hierophantFeatures.Spell Power +2', '+=', '"divine"'
    );

  } else if(name == 'Red Wizard') {

    rules.defineRule('sumItemCreationAndMetamagicFeats',
      'sumItemCreationFeats', '=', null,
      'sumMetamagicFeats', '+', null
    );
    rules.defineRule
      ('magicNotes.arcaneCasterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.spellPower', classLevel, '+=', 'Math.floor(source / 2)');
    rules.defineRule('magicNotes.spellPower.1',
      'redWizardFeatures.Spell Power', '=', '"%{redWizardSpecialistSchool}"'
    );
    rules.defineRule('redWizardSpecialistSchool', classLevel, '?', null);
    for(let s in rules.getChoices('schools'))
      rules.defineRule('redWizardSpecialistSchool',
        'features.School Specialization (' + s + ')', '=', '"' + s.toLowerCase() + '"'
      );
    rules.defineRule('selectableFeatureCount.Wizard (Opposition)',
      'magicNotes.enhancedSpecialization', '+', '1'
    );

  } else if(name == 'Runecaster') {

    rules.defineRule
      ('magicNotes.divineCasterLevelBonus', classLevel, '+=', null);

  } else if(name == 'Shadow Adept') {

    rules.defineRule
      ('features.Insidious Magic', 'featureNotes.shadowFeats', '=', '1');
    rules.defineRule
      ('features.Pernicious Magic', 'featureNotes.shadowFeats', '=', '1');
    rules.defineRule
      ('features.Tenacious Magic', 'featureNotes.shadowFeats', '=', '1');
    // Override featureRules' + with +=
    rules.defineRule
      ('featCount.Metamagic', 'featureNotes.shadowAdeptBonusFeats', '+=', null);
    rules.defineRule('magicNotes.casterLevelBonus', classLevel, '+=', null);
    rules.defineRule
      ('magicNotes.spellPower', classLevel, '+=', 'Math.floor(source / 3)');
    rules.defineRule('magicNotes.spellPower.1',
      'shadowAdeptFeatures.Spell Power', '=', '"enchantment, illusion, necromancy, and darkness"'
    );

  } else {

    if(rules.basePlugin.classRulesExtra)
      rules.basePlugin.classRulesExtra(rules, name);

    if(name == 'Cleric') {
      rules.defineRule
        ('resistance.Electricity', 'saveNotes.stormfriend', '^=', '5');
      rules.defineRule
        ('combatNotes.extraTurning', 'clericFeatures.Extra Turning', '+=', '4');
    }

  }

  if(feats != null && allFeats != null) {
    for(let j = 0; j < feats.length; j++) {
      let feat = feats[j];
      if(!(feat in allFeats)) {
        console.log('Unknown feat "' + feat + '" for class "' + name + '"');
        continue;
      }
      allFeats[feat] = allFeats[feat].replace('Type=', 'Type="' + name + '",');
    }
  }

};

/*
 * Defines in #rules# the rules required to give feature #name# to class
 * #className# at level #level#. #selectable# gives the category if this feature
 * is selectable; it is otherwise null. #require# lists any hard prerequisites
 * for the feature, and #replace# lists any class features that this new one
 * replaces.
 */
Realms.classFeatureRules = function(
  rules, name, require, className, level, selectable, replace
) {
  rules.basePlugin.classFeatureRules
    (rules, name, require, className, level, selectable, replace);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack#, does
 * #damage# damage, moves at #speed# (which can be a fly or swim speed for
 * creatures who normally use that form of movement) and is size #size#. If
 * specified, #level# indicates the minimum master level the character needs to
 * have this animal as a companion.
 */
Realms.companionRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  speed, level
) {
  rules.basePlugin.companionRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    speed, level
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
 * and armor class #ac#. The familiar has attack bonus #attack#, does
 * #damage# damage, moves at #speed# (which can be a fly or swim speed for
 * creatures who normally use that form of movement) and is size #size#. If
 * specified, #level# indicates the minimum master level the character needs to
 * have this animal as a familiar.
 */
Realms.familiarRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  speed, level
) {
  rules.basePlugin.familiarRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
    speed, level
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

  let matchInfo;

  if(name == 'Bloodline Of Fire') {
    rules.defineRule
      ('magicNotes.bloodlineOfFire', 'levels.Sorcerer', '?', null);
  } else if(name == 'Militia') {
    rules.defineRule
      ('combatNotes.militia', 'region', '?', 'source != "Luiren"');
    rules.defineRule('combatNotes.militia(Luiren)',
      'region', '?', 'source == "Luiren"',
      'features.Militia', '=', null
    );
  } else if(name == 'Mind Over Body') {
    rules.defineRule('combatNotes.mindOverBody.1',
      'combatNotes.mindOverBody', '=', '0',
      'sumMetamagicFeats', '+', null
    );
    rules.defineRule('hitPoints', 'combatNotes.mindOverBody.1', '+', null);
  } else if((matchInfo = name.match(/^Spellcasting\sProdigy\s\((.*)\)$/)) != null) {
    let clas = matchInfo[1];
    let spellCode = clas.charAt(0);
    let ability = {'Bard':'charisma', 'Cleric':'wisdom', 'Druid':'wisdom', 'Sorcerer':'charisma', 'Wizard':'intelligence'}[clas];
    rules.defineRule('spellDifficultyClass.' + clas,
      'magicNotes.spellcastingProdigy(' + clas + ')', '+', '1'
    );
    rules.defineRule('prodigyAbility' + clas,
      'magicNotes.spellcastingProdigy(' + clas + ')', '?', null,
      ability + 'Modifier', '=', 'source + 1'
    );
    for(let spellLevel = 1; spellLevel <= 5; spellLevel++) {
      rules.defineRule('spellSlots.' + spellCode + spellLevel,
        'prodigyAbility' + clas, '+', 'source == ' + spellLevel + ' ? 1 : null'
      );
    }
  } else if(name == 'Tattoo Focus') {
    for(let s in rules.getChoices('schools')) {
      rules.defineRule('magicNotes.tattooFocus',
        'features.School Specialization (' + s + ')', '=', '"' + s + '"'
      );
    }
  } else if(rules.basePlugin.featRulesExtra) {
    rules.basePlugin.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements. #spells# lists any spells
 * acquired as part of the feature, and #spellAbility# is the ability used to
 * calculate attack and difficulty class for these spells.
 */
Realms.featureRules = function(
  rules, name, sections, notes, spells, spellAbility
) {
  if(rules.basePlugin == window.Pathfinder) {
    for(let i = 0; i < sections.length; i++) {
      if(sections[i] != 'skill')
        continue;
      let note = notes[i];
      for(let skill in Pathfinder.SRD35_SKILL_MAP) {
        if(note.indexOf(skill) < 0)
          continue;
        let pfSkill = Pathfinder.SRD35_SKILL_MAP[skill];
        if(pfSkill == '' || note.indexOf(pfSkill) >= 0) {
          note = note.replace(new RegExp('[,/]?[^,/:]*' + skill + '[^,/]*', 'g'), '');
        } else {
          note = note.replace(new RegExp(skill, 'g'), pfSkill);
        }
      }
      notes[i] = note;
    }
  }
  rules.basePlugin.featureRules
    (rules, name, sections, notes, spells, spellAbility);
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
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# any automatic languages.
 * #speed# give the race's size (one of Small, Medium, or Large) and speed.
 */
Realms.raceRules = function(
  rules, name, requires, features, selectables, languages, size, speed
) {
  rules.basePlugin.raceRules
    (rules, name, requires, features, selectables, languages, size, speed);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that cannot be
 * derived directly from the abilities passed to raceRules.
 */
Realms.raceRulesExtra = function(rules, name) {
  let raceLevel =
    name.charAt(0).toLowerCase() + name.substring(1).replaceAll(' ', '') + 'Level';
  let matchInfo;
  if((matchInfo = name.match(/^(\w+)\sGenasi$/)) != null) {
    let element = matchInfo[1];
    let elementLowered = element.toLowerCase();
    rules.defineRule('saveNotes.genasiResistance',
      raceLevel, '=', '"' + elementLowered + '"'
    );
    rules.defineRule('validationNotes.clericalFocus',
      'clericFeatures.' + element + ' Domain', '=', 'dict.' + raceLevel + ' ? 0 : null'
    );
    rules.defineRule('validationNotes.clericalFocus.1',
      raceLevel, '=', '"' + elementLowered + '"'
    );
  }
  if(name == 'Aasimar') {
    rules.defineRule
      ('resistance.Acid', 'saveNotes.aasimarResistance', '^=', '5');
    rules.defineRule
      ('resistance.Cold', 'saveNotes.aasimarResistance', '^=', '5');
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.aasimarResistance', '^=', '5');
  } else if(name == 'Deep Gnome') {
    rules.defineRule('saveNotes.deepGnomeSpellResistance',
      'deepGnomeLevel', '=', 'source + 11'
    );
    // Several web pages say that the DC for Deep Gnome spells is Charisma
    // based with a +4 racial modifier. The FG Campaign Setting says 10 +
    // spell level, so we go with that; otherwise, the value would be
    // 14 + source instead of 10
    rules.defineRule('spellDifficultyClass.DeepGnomeMagic',
      'casterLevels.DeepGnomeMagic', '?', null,
      'charismaModifier', '=', '10'
    );
    rules.defineRule
      ('spellResistance', 'saveNotes.deepGnomeSpellResistance', '^=', null);
  } else if(name == 'Drow Elf') {
    rules.defineRule('combatNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule
      ('saveNotes.drowElfSpellResistance', 'drowElfLevel', '=', 'source + 11');
    rules.defineRule('saveNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule('skillNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule
      ('spellResistance', 'saveNotes.drowElfSpellResistance', '^=', null);
  } else if(name == 'Gray Dwarf') {
    rules.defineRule('combatNotes.lightSensitivity', 'grayDwarfLevel', '=','2');
    rules.defineRule('saveNotes.lightSensitivity', 'grayDwarfLevel', '=', '2');
    rules.defineRule('skillNotes.lightSensitivity', 'grayDwarfLevel', '=', '2');
  } else if(name == 'Tiefling') {
    rules.defineRule
      ('resistance.Cold', 'saveNotes.tieflingResistance', '^=', '5');
    rules.defineRule
      ('resistance.Electricity', 'saveNotes.tieflingResistance', '^=', '5');
    rules.defineRule
      ('resistance.Fire', 'saveNotes.tieflingResistance', '^=', '5');
  } else if(rules.basePlugin.raceRulesExtra) {
    rules.basePlugin.raceRulesExtra(rules, name);
  }
};

/*
 * Defines in #rules# the rules required to give feature #name# to race
 * #raceName# at level #level#. #selectable# gives the category if this feature
 * is selectable; it is otherwise null. #require# lists any hard prerequisites
 * for the feature, and #replace# lists any race features that this new one
 * replaces.
 */
Realms.raceFeatureRules = function(
  rules, name, require, raceName, level, selectable, replace
) {
  rules.basePlugin.raceFeatureRules
    (rules, name, require, raceName, level, selectable, replace);
  // No changes needed to the rules defined by base method
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
 * to the character's armor class, requires a #weight# proficiency level to
 * use effectively, allows a maximum dex bonus to ac of #maxDex#, imposes
 * #skillFail# on specific skills and yields a #spellFail# percent chance of
 * arcane spell failure.
 */
Realms.shieldRules = function(
  rules, name, ac, weight, maxDex, skillFail, spellFail
) {
  rules.basePlugin.shieldRules
    (rules, name, ac, weight, maxDex, skillFail, spellFail);
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
  if(name.startsWith('Knowledge ('))
    rules.defineRule('classSkills.' + name, 'skillNotes.education', '=', '1');
  if(name.startsWith('Perform ('))
    rules.defineRule('skillModifier.' + name, 'skillNotes.artist', '+', '2');
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a concise
 * description of the spell's effects. #liquids# lists any liquid forms via
 * which the spell can be applied.
 */
Realms.spellRules = function(
  rules, name, school, casterGroup, level, description, domainSpell, liquids
) {
  rules.basePlugin.spellRules
    (rules, name, school, casterGroup, level, description, domainSpell,
     liquids);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with weapon #name#, which requires a
 * #profLevel# proficiency level to use effectively and belongs to weapon
 * category #category# (one of '1h', '2h', 'Li', 'R', 'Un' or their spelled-out
 * equivalents). The weapon does #damage# HP on a successful attack and
 * threatens x#critMultiplier# (default 2) damage on a roll of #threat# (default
 * 20). If specified, the weapon can be used as a ranged weapon with a range
 * increment of #range# feet. #properties# lists any additional properties of
 * the weapon, such as "Thrown" or "Reach".
 */
Realms.weaponRules = function(
  rules, name, profLevel, category, damage, threat, critMultiplier, range,
  properties
) {
  rules.basePlugin.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range,
    properties
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
    let choices = [];
    let races = this.getChoices('races');
    let regions = this.getChoices('regions');
    for(let region in regions) {
      if(races[region] == null || region == attributes.race) {
        choices[choices.length] = region;
      }
    }
    attributes[attribute] = choices[QuilvynUtils.random(0, choices.length - 1)];
  } else {
    this.basePlugin.randomizeOneAttribute.apply(this, [attributes, attribute]);
    if(attribute == 'levels') {
      // Recompute experience to account for level offset for some races
      let attrs = this.applyRules(attributes);
      if(QuilvynUtils.sumMatching(attrs, /LevelAdjustment/) > 0) {
        let level = QuilvynUtils.sumMatching(attrs, /^levels\./) +
                    QuilvynUtils.sumMatching(attrs, /LevelAdjustment/);
        let max = level * (level + 1) * 1000 / 2 - 1;
        let min = level * (level - 1) * 1000 / 2;
        if(!attributes.experience || attributes.experience < min)
          attributes.experience = QuilvynUtils.random(min, max);
      }
    }
  }
};

/* Returns an array of plugins upon which this one depends. */
Realms.getPlugins = function() {
  let base = this.basePlugin == window.SRD35 ? window.PHB35 : this.basePlugin;
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
    '  </li><li>\n' +
    '    The Forgotten Realms rule set allows you to add homebrew choices\n' +
    '    for all of the same types discussed in the <a href="plugins/homebrew-srd35.html">SRD v3.5 Homebrew Examples document</a>.\n' +
    '    In addition, the FR rule set allows adding homebrew regions, which\n' +
    '    require specifying only the region name.\n' +
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
