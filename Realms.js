/*
Copyright 2020, James J. Hayes

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

var REALMS_VERSION = '2.1.1.0';

/*
 * This module loads the rules from the Forgotten Realms v3 source book. The
 * Realms function contains methods that load rules for particular
 * parts/chapters of the rule book: raceRules for character races, magicRules
 * for spells, etc.  These member methods can be called independently in order
 * to use a subset of the rules.  Similarly, the constant fields of Realms
 * (DEITIES, FEATS, etc.) can be manipulated to modify the user's choices.
 */
function Realms() {

  if(window.SRD35 == null) {
    alert('The Realms module requires use of the SRD35 module');
    return;
  }

  if(window.Pathfinder == null || Pathfinder.SRD35_SKILL_MAP == null) {
    Realms.USE_PATHFINDER = false;
  }
  Realms.baseRules = Realms.USE_PATHFINDER ? Pathfinder : SRD35;

  var rules = new QuilvynRules
    ('Forgotten Realms' + (Realms.USE_PATHFINDER ? ' - PF' : ''), REALMS_VERSION);
  Realms.rules = rules;

  Realms.CHOICES = Realms.baseRules.CHOICES.concat(Realms.CHOICES_ADDED);
  rules.defineChoice('choices', Realms.CHOICES);
  rules.choiceEditorElements = Realms.choiceEditorElements;
  rules.choiceRules = Realms.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Realms.randomizeOneAttribute;
  Realms.RANDOMIZABLE_ATTRIBUTES =
    Realms.baseRules.RANDOMIZABLE_ATTRIBUTES.concat
    (Realms.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', Realms.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Realms.ruleNotes;

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras', 'feats', 'featCount', 'selectableFeatureCount');
  rules.defineChoice('preset', 'race', 'level', 'levels');

  Realms.ALIGNMENTS = Object.assign({}, Realms.baseRules.ALIGNMENTS);
  Realms.ANIMAL_COMPANIONS =
    Object.assign( {}, Realms.baseRules.ANIMAL_COMPANIONS);
  Realms.ARMORS = Object.assign({}, Realms.baseRules.ARMORS);
  Realms.CLASSES = Object.assign({}, Realms.baseRules.CLASSES);
  for(var clas in Realms.CLASS_SPELLS_ADDED) {
    Realms.CLASSES[clas] = Realms.CLASSES[clas].replace('Spells=', 'Spells=' + Realms.CLASS_SPELLS_ADDED[clas] + ',');
  }
  Realms.FAMILIARS = Object.assign({}, Realms.baseRules.FAMILIARS);
  Realms.FEATS =
    Object.assign({}, Realms.baseRules.FEATS, Realms.FEATS_ADDED);
  Realms.FEATURES =
    Object.assign({}, Realms.baseRules.FEATURES, Realms.FEATURES_ADDED);
  Realms.LANGUAGES =
    Object.assign({}, Realms.baseRules.LANGUAGES, Realms.LANGUAGES_ADDED);
  Realms.PATHS =
    Object.assign({}, Realms.baseRules.PATHS, Realms.PATHS_ADDED);
  Realms.RACES['Gold Dwarf'] =
    Realms.baseRules.RACES['Dwarf']
      .replace('Dwarf Ability', 'Gold Dwarf Ability')
      .replace('Dwarf Enmity', 'Gold Dwarf Enmity'),
  Realms.RACES['Shield Dwarf'] =
    Realms.baseRules.RACES['Dwarf'],
  Realms.RACES['Moon Elf'] =
    Realms.baseRules.RACES['Elf'],
  Realms.RACES['Sun Elf'] =
    Realms.baseRules.RACES['Elf'].replace('Elf Ability', 'Sun Elf Ability'),
  Realms.RACES['Wild Elf'] =
    Realms.baseRules.RACES['Elf'].replace('Elf Ability', 'Wild Elf Ability'),
  Realms.RACES['Wood Elf'] =
    Realms.baseRules.RACES['Elf'].replace('Elf Ability', 'Wood Elf Ability'),
  Realms.RACES['Rock Gnome'] =
    Realms.baseRules.RACES['Gnome'],
  Realms.RACES['Half-Elf'] =
    Realms.baseRules.RACES['Half-Elf'],
  Realms.RACES['Half-Orc'] =
    Realms.baseRules.RACES['Half-Orc'],
  Realms.RACES['Ghostwise Halfling'] =
    Realms.baseRules.RACES['Halfling']
      .replace(/['"]?Fortunate['"]?/, '"Speak Without Sound"'),
  Realms.RACES['Lightfoot Halfling'] =
    Realms.baseRules.RACES['Halfling'],
  Realms.RACES['Strongheart Halfling'] =
    Realms.baseRules.RACES['Halfling']
      .replace(/['"]?Fortunate['"]?/, '"Strongheart Feat Bonus"'),
  Realms.RACES['Human'] =
    Realms.baseRules.RACES['Human'],
  Realms.SCHOOLS = Object.assign({}, Realms.baseRules.SCHOOLS);
  Realms.SHIELDS = Object.assign({}, Realms.baseRules.SHIELDS);
  Realms.SKILLS = Object.assign({}, Realms.baseRules.SKILLS);
  Realms.SPELLS =
    Object.assign({}, Realms.baseRules.SPELLS, Realms.SPELLS_ADDED);
  Realms.WEAPONS =
    Object.assign({}, Realms.baseRules.WEAPONS, Realms.WEAPONS_ADDED);

  Realms.abilityRules(rules);
  Realms.aideRules(rules, Realms.ANIMAL_COMPANIONS, Realms.FAMILIARS);
  Realms.combatRules(rules, Realms.ARMORS, Realms.SHIELDS, Realms.WEAPONS);
  // Spell definition is handled by each individual class and domain. Schools
  // have to be defined before this can be done.
  Realms.magicRules(rules, Realms.SCHOOLS, []);
  // Feats must be defined before classes
  Realms.talentRules
    (rules, Realms.FEATS, Realms.FEATURES, Realms.LANGUAGES, Realms.SKILLS);
  Realms.identityRules(
    rules, Realms.ALIGNMENTS, Realms.CLASSES, Realms.DEITIES, Realms.PATHS,
    Realms.RACES, Realms.REGIONS
  );
  Realms.goodiesRules(rules);

  if(window.SRD35NPC != null) {
    SRD35NPC.identityRules(rules, SRD35NPC.CLASSES);
    SRD35NPC.talentRules(rules, SRD35NPC.FEATURES);
  }
  if(window.SRD35Prestige != null) {
    SRD35Prestige.identityRules(rules, SRD35NPC.CLASSES);
    SRD35Prestige.talentRules(rules, SRD35NPC.FEATURES);
  }

  Quilvyn.addRuleSet(rules);

}

// Realms uses SRD35 as its default base ruleset. If USE_PATHFINDER is true,
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
Realms.DEITIES = {
  'None':'',
  'Akadi':'Alignment=N Weapon="Heavy Flail" Domain=Air,Illusion,Travel,Trickery',
  'Auril':'Alignment=NE Weapon=Battleaxe Domain=Air,Evil,Storm,Water',
  'Azuth':'Alignment=LN Weapon=Quarterstaff Domain=Illusion,Magic,Knowledge,Law,Spell',
  'Bane':'Alignment=LE Weapon=Morningstar Domain=Destruction,Evil,Hatred,Law,Tyranny',
  'Beshaba':'Alignment=CE Weapon=Scourge Domain=Chaos,Evil,Fate,Luck,Trickery',
  'Chauntea':'Alignment=NG Weapon=Scythe Domain=Animal,Earth,Good,Plant,Protection,Renewal',
  'Cyric':'Alignment=CE Weapon=Longsword Domain=Chaos,Destruction,Evil,Illusion,Trickery',
  'Deneir':'Alignment=NG Weapon=Dagger Domain=Good,Knowledge,Protection,Rune',
  'Eldath':'Alignment=NG Weapon=Net Domain=Family,Good,Plant,Protection,Water',
  'Finder Wyvernspur':'Alignment=CN Weapon="Bastard Sword" Domain=Chaos,Charm,Renewal,Scalykind',
  'Garagos':'Alignment=CN Weapon=Longsword Domain=Chaos,Destruction,Strength,War',
  'Gargauth':'Alignment=LE Weapon=Dagger,"Throwing Dagger" Domain=Charm,Evil,Law,Trickery',
  'Gond':'Alignment=N Weapon=Warhammer Domain=Craft,Earth,Fire,Knowledge,Metal,Planning',
  'Grumbar':'Alignment=N Weapon=Warhammer Domain=Cavern,Earth,Metal,Time',
  'Gwaeron Windstrom':'Alignment=NG Weapon=Greatsword Domain=Animal,Good,Knowledge,Plant,Travel',
  'Helm':'Alignment=LN Weapon="Bastard Sword" Domain=Law,Planning,Protection,Strength',
  'Hoar':'Alignment=LN Weapon=Javelin Domain=Fate,Law,Retribution,Travel',
  'Ilmater':'Alignment=LG Weapon=Unarmed Domain=Good,Healing,Law,Strength,Suffering',
  'Istishia':'Alignment=N Weapon=Warhammer Domain=Destruction,Ocean,Storm,Travel,Water',
  'Jergal':'Alignment=LN Weapon=Scythe Domain=Death,Fate,Law,Rune,Suffering',
  'Kelemvor':'Alignment=LN Weapon="Bastard Sword" Domain=Death,Fate,Law,Protection,Travel',
  'Kossuth':'Alignment=N Weapon="Spiked Chain" Domain=Destruction,Fire,Renewal,Suffering',
  'Lathander':'Alignment=NG Weapon="Heavy Mace","Light Mace" Domain=Good,Nobility,Protection,Renewal,Strength,Sun',
  'Lliira':'Alignment=CG Weapon=Shuriken Domain=Chaos,Charm,Family,Good,Travel',
  'Loviatar':'Alignment=LE Weapon=Scourge Domain=Evil,Law,Retribution,Strength,Suffering',
  'Lurue':'Alignment=CG Weapon=Shortspear Domain=Animal,Chaos,Good,Healing',
  'Malar':'Alignment=CE Weapon="Claw Bracer" Domain=Animal,Chaos,Evil,Moon,Strength',
  'Mask':'Alignment=NE Weapon=Longsword Domain=Darkness,Evil,Luck,Trickery',
  'Mielikki':'Alignment=NG Weapon=Scimitar Domain=Animal,Good,Plant,Travel',
  'Milil':'Alignment=NG Weapon=Rapier Domain=Charm,Good,Knowledge,Nobility',
  'Mystra':'Alignment=NG Weapon=Shuriken Domain=Good,Illusion,Knowledge,Magic,Rune,Spell',
  'Nobanion':'Alignment=LG Weapon="Heavy Pick" Domain=Animal,Good,Law,Nobility',
  'Oghma':'Alignment=N Weapon=Longsword Domain=Charm,Knowledge,Luck,Travel,Trickery',
  'Red Knight':'Alignment=LN Weapon=Longsword Domain=Law,Nobility,Planning,War',
  'Savras':'Alignment=LN Weapon=Dagger Domain=Fate,Knowledge,Law,Magic,Spell',
  'Selune':'Alignment=CG Weapon="Heavy Mace" Domain=Chaos,Good,Moon,Protection,Travel',
  'Shar':'Alignment=NE Weapon=Chakram Domain=Cavern,Darkness,Evil,Knowledge',
  'Sharess':'Alignment=CG Weapon="Claw Bracer" Domain=Chaos,Charm,Good,Travel,Trickery',
  'Shaundakul':'Alignment=CN Weapon=Greatsword Domain=Air,Chaos,Portal,Protection,Trade,Travel',
  'Shiallia':'Alignment=NG Weapon=Quarterstaff Domain=Animal,Good,Plant,Renewal',
  'Siamorphe':'Alignment=LN Weapon="Light Mace" Domain=Knowledge,Law,Nobility,Planning',
  'Silvanus':'Alignment=N Weapon=Maul Domain=Animal,Plant,Protection,Renewal,Water',
  'Sune':'Alignment=CG Weapon=Whip Domain=Chaos,Charm,Good,Protection',
  'Talona':'Alignment=CE Weapon=Unarmed Domain=Chaos,Destruction,Evil,Suffering',
  'Talos':'Alignment=CE Weapon=Halfspear,Longspear,Shortspear Domain=Chaos,Destruction,Evil,Fire,Storm',
  'Tempus':'Alignment=CN Weapon=Battleaxe Domain=Chaos,Protection,Strength,War',
  'Tiamat':'Alignment=LE Weapon="Heavy Pick" Domain=Evil,Law,Scalykind,Tyranny',
  'Torm':'Alignment=LG Weapon=Greatsword Domain=Good,Healing,Law,Protection,Strength',
  'Tymora':'Alignment=CG Weapon=Shuriken Domain=Chaos,Good,Luck,Protection,Travel',
  'Tyr':'Alignment=LG Weapon=Longsword Domain=Good,Knowledge,Law,Retribution,War',
  'Ubtao':'Alignment=N Weapon="Heavy Pick" Domain=Planning,Plant,Protection,Scalykind',
  'Ulutiu':'Alignment=LN Weapon=Longspear,Shortspear Domain=Animal,Law,Ocean,Protection,Strength',
  'Umberlee':'Alignment=CE Weapon=Trident Domain=Chaos,Destruction,Evil,Ocean,Storm,Water',
  'Uthgar':'Alignment=CN Weapon=Battleaxe Domain=Animal,Chaos,Retribution,Strength,War',
  'Valkur':'Alignment=CG Weapon=Cutlass Domain=Air,Chaos,Good,Ocean,Protection',
  'Velsharoon':'Alignment=NE Weapon=Quarterstaff Domain=Death,Evil,Magic,Undeath',
  'Waukeen':'Alignment=N Weapon=Nunchaku Domain=Knowledge,Protection,Trade,Travel'
};
Realms.FAMILIARS = Object.assign({}, SRD35.FAMILIARS);
Realms.FEATS_ADDED = {
  'Arcane Preparation':'Type=General Require="levels.Bard || levels.Sorcerer"',
  'Arcane Schooling':'Type=General Require="Region =~ \'Chessenta|Halruaa|Lantan|Mulhorand|Unther\'"',
  'Artist':'Type=General Imply="Sum \'skills.Perform\' > 0 || Sum \'skills.Craft\' > 0" Require="Region =~ \'Chessenta|Evermeet|Waterdeep|Rock Gnome\'"',
  'Blooded':'Type=General Require="region =~ \'Dalelands|Nelanther Isles|Sembia|Silverymoon|Tethyr|Vaasa\'"',
  'Bloodline Of Fire':'Type=General Require="region == \'Calimshan\'"',
  'Bullheaded':'Type=General Require="region =~ \'Damara|Dragon Coast|Great Dale|Moonshaes|Narfell|Nelanther Isles|Rashemen|Vaasa|Western Heartlands|Gold Dwarf|Gray Dwarf|Shield Dwarf\'"',
  'Cosmopolitan':'Type=General Require="region =~ \'Amn|Waterdeep\'"',
  'Courteous Magocracy':'Type=General Require="skills.Diplomacy||skills.Spellcraft","region =~ \'Evermeet|Halruaa\'"',
  'Create Portal':'Type="Item Creation" Require="features.Craft Wondrous Item"',
  'Daylight Adaptation':'Type=General Require="region =~ \'Drow|Gray Dwarf|Orc\'"',
  'Delay Spell':'Type=Metamagic Imply="casterLevel >= 1" Require="SumMetamagicFeats >= 1"',
  'Discipline':'Type=General Require="region =~ \'Aglarond|Anauroch|Cormyr|Impitur|Thay|Strongheart Halfling|Sun Elf|Rock Gnome\'"',
  'Education':'Type=General Require="region =~ \'Amn|Chessenta|Cormyr|Evermeet|Lantan|Mulhorand|Sembia|Silverymoon|Waterdeep|Moon Elf|Sun Elf\'"',
  'Ethran':'Type=General Require="charisma >= 11","casterLevel >= 1","gender == \'Female\'","region == \'Rashemen\'"',
  'Foe Hunter':'Type=Fighter Require="region =~ \'Chult|Cormyr|Damara|Lake Of Steam|The North|Moonsea|Tashalar|Thethyr|Vaasa|Shield Dwarf|Wood Elf\'"',
  'Forester':'Type=General Require="region =~ \'Chondalwood|Dalelands|Great Dale|High Forest|Ghostwise Halfling|Moon Elf|Wild Elf|Moon Elf\'"',
  'Horse Nomad':'Type=Fighter Require="region =~ \'Hordelands|The Shaar|Vaasa\'"',
  'Innate Spell':'Type=General Require="features.Quicken Spell/features.ilent Spell/features.till Spell"',
  'Inscribe Rune':'Type="Item Creation" Require="intelligence >= 13","casterLevelDivine >= 3"',
    // TBD 'Requires appropriate Craft skill'
  'Insidious Magic':'Type=Metamagic Require="features.Shadow Weave Magic"',
  'Luck Of Heroes':'Type=General Require="region =~ \'Aglarond|Dalelands|Tethyr|The Vast\'"',
  'Magical Artisan':'Type=General Imply="casterLevel >= 1" Require="SumItemCreationFeats >= 1"',
  'Magical Training':'Type=General Require="Intelligence >= 10","region == \'Halruaa\'"',
  'Mercantile Background':'Type=General Require="Sum \'skills.Appraise\' > 0||Sum \'skills.Craft\' > 0||Sum \'skills.Profession\' > 0","region =~ \'Impiltur|Lake Of Steam|Lantan|Sembia|Tashalar|Tethyr|Thesk|The Vast|Deep Gnome|Gray Dwarf\'"',
  'Militia':'Type=General Require="region =~ \'Dalelands|Impiltur|Luiren|Strongheart Halfling\'"',
  'Mind Over Body':'Type=General Imply="intelligenceModifier >= constitutionModifier" Require="region =~ \'Calimshan|Thay|Moon Elf|Sun Elf\'"',
  'Pernicious Magic':'Type=Metamagic Require="features.Shadow Weave Magic"',
  'Persistent Spell':'Type=Metamagic Require="features.Extend Spell"',
  'Resist Poison Training':'Type=General Require="region =~ \'Gray Dwarf|Half Orc|Orc\'"',
  'Saddleback':'Type=Fighter Require="region =~ \'Cormyr|Hordelands|Narfell|The North|Western Heartlands\'"',
  'Shadow Weave Magic':'Type=General Imply="casterLevel >= 1" Require="wisdom >= 13 || deity == \'Shar\'"',
  'Signature Spell':'Type=General Require="features.Spell Mastery"',
  'Silver Palm':'Type=General Require="region =~ \'Amn|Dragon Coast|Great Dale|Impiltur|Moonsea|Sembia|The Shaar|Thesk|Vilhon Reach|Gold Dwarf|Gray Dwarf\'"',
  'Smooth Talk':'Type=General Require="region =~ \'Luiren|Silverymoon|Thesk|Waterdeep|Gold Dwarf|Lightfoot Halfling\'"',
  'Snake Blood':'Type=General Require="region =~ \'Chult|Tashalar|Vilhon Reach\'"',
  'Spellcasting Prodigy (Bard)':'Type=General Imply="levels.Bard >= 1"',
  'Spellcasting Prodigy (Cleric)':'Type=General Imply="levels.Cleric >= 1"',
  'Spellcasting Prodigy (Druid)':'Type=General Imply="levels.Druid >= 1"',
  'Spellcasting Prodigy (Sorcerer)':'Type=General Imply="levels.Druid >= 1"',
  'Spellcasting Prodigy (Wizard)':'Type=General Imply="levels.Druid >= 1"',
  'Stealthy':'Type=General Require="region =~ \'Drow Elf|Half Orc|Ghostwise Halfling|Lightfoot Halfling|Strongheart Halfling\'"',
  'Street Smart':'Type=General Require="region =~ \'Amn|Calimshan|Chessenta|Moonsea|Unther\'"',
  'Strong Soul':'Type=General Require="region =~ \'Dalelands|Moonshaes|Deep Gnome|Ghostwise Halfling|Lightfoot Halfling|Moon Elf|Rock Gnome|Strongheart Halfling|Sun Elf|Wild Elf|Wood Elf\'"',
  'Survivor':'Type=General Require="region =~ \'Anauroch|Chondalwood|Chult|Damara|Hordelands|Moonshaes|Narfell|The North|The Shaar|Rashemen|Silverymoon|Vaasa|Vilhon Reach|Western Heartlands|Deep Gnome|Drow Elf|Lightfoot Halfling|Ghostwise Halfling|Shield Dwarf|Wild Elf\'"',
  'Tattoo Focus':'Type=General Require="levels.Wizard >= 1","features.School Specialization (None) == 0","region == \'Thay\'"',
  'Tenacious Magic':'Type=Metamagic Imply="casterLevel >= 1" Require="features.Shadow Weave Magic"',
  'Thug':'Type=General Require="region =~ \'Calimshan|Dragon Coast|Moonsea|elanther Isles|Unther|The Vast|Vilhon Reach|Waterdeep\'"',
  'Thunder Twin':'Type=General Require="region =~ \'Gold Dwarf|Shield Dwarf\'"',
  'Treetopper':'Type=General Require="region =~ \'Aglarond|Chondalwood|High Forest|Ghostwise Halfling|Wild Elf|Wood Elf\'"',
  'Twin Spell':'Type=Metamagic Imply="casterLevel >= 1" Require="SumMetamagicFeats >= 1"',
  'Twin Sword Style':'Type=Fighter Require="features.Two Weapon Fighting","region =~ \'Sembia|Waterdeep|Drow Elf\'"',
};
Realms.FEATS = Object.assign({}, SRD35.FEATS, Realms.FEATS_ADDED);
Realms.FEATURES_ADDED = {
  // Feat
  'Arcane Preparation':'Section=magic Note="Prepare arcane spell ahead of time"',
  'Arcane Schooling':'Section=magic Note="Designated arcane class is favored"',
  'Artist':'Section=skill Note="+2 Perform/+2 chosen Craft"',
  'Blooded':'Section=combat,skill Note="+2 Initiative","+2 Spot"',
  'Bloodline Of Fire':'Section=magic,save Note="+2 DC Sorcerer fire spells","+4 vs. fire spells"',
  'Bullheaded':'Section=save,skill Note="+1 Will","+2 Intimidate"',
  'Cosmopolitan':'Section=skill Note="Chosen skill is class skill/+2 chosen skill checks"',
  'Courteous Magocracy':'Section=skill Note="+2 Diplomacy/+2 Spellcraft"',
  'Create Portal':'Section=magic Note="Create magical portal"',
  'Daylight Adaptation':'Section=feature Note="No bright light penalties"',
  'Delay Spell':'Section=magic Note="Delay effect of spell 1-5 rd"',
  'Discipline':'Section=save,skill Note="+1 Will","+2 Concentration"',
  'Education':'Section=skill Note="All Knowledge skills class skills/+1 any 2 Knowledge skills"',
  // Substitute for SRD3.0 skills Animal Empathy/Intuit Direction
  'Ethran':'Section=ability,skill Note="+2 charisma w/Rashemi","+2 Handle Animal/Survival"',
  'Foe Hunter':'Section=combat Note="+1 damage, double critical range w/regional foe"',
  'Forester':'Section=skill Note="+2 Heal/Survival"',
  // Identical to SRD35, but +3 DC instead of +1
  'Greater Spell Focus (Abjuration)':
    'Section=magic Note="+3 Spell DC (Abjuration)"',
  'Greater Spell Focus (Conjuration)':
    'Section=magic Note="+3 Spell DC (Conjuration)"',
  'Greater Spell Focus (Divination)':
    'Section=magic Note="+3 Spell DC (Divination)"',
  'Greater Spell Focus (Enchantment)':
    'Section=magic Note="+3 Spell DC (Enhancement)"',
  'Greater Spell Focus (Evocation)':
    'Section=magic Note="+3 Spell DC (Evocation)"',
  'Greater Spell Focus (Illusion)':
    'Section=magic Note="+3 Spell DC (Illusion)"',
  'Greater Spell Focus (Necromancy)':
    'Section=magic Note="+3 Spell DC (Necromancy)"',
  'Greater Spell Focus (Transmutation)':
    'Section=magic Note="+3 Spell DC (Transmutation)"',
  'Horse Nomad':'Section=combat,skill Note="Martial Weapon Proficiency (Composite Shortbow)","+2 Ride"',
  'Innate Spell':'Section=magic Note="Designated spells as spell-like ability 1/rd uses +8 spell slot"',
  'Inscribe Rune':'Section=magic Note="Cast divine spell via rune"',
  'Insidious Magic':'Section=magic Note="DC 9+foe level check to detect Weave magic, Foe DC %V check to detect Shadow Weave spell"',
  'Luck Of Heroes':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Magical Artisan':'Section=magic Note="Reduce item creation base price by 25%"',
  'Magical Training':'Section=magic Note="<i>Dancing Lights</i>, <i>Daze</i>, <i>Mage Hand</i> 1/dy"',
  'Mercantile Background':'Section=skill Note="+2 Appraise/chosen Craft/chosen Profession"',
  'Militia':'Section=combat Note="Additional martial weapon proficiencies"',
  'Mind Over Body':'Section=combat Note="Intelligence modifier adds %1 HP, +%2 HP from Metamagic feats"',
  'Pernicious Magic':'Section=magic Note="Weave foes DC %V check to counterspell/DC 9+foe level to counterspell Weave foes"',
  'Persistent Spell':'Section=magic Note="Fixed-range spell lasts 24 hr"',
  'Resist Poison Training':'Section=save Note="+4 vs. poison"',
  'Saddleback':'Section=skill Note="+3 Ride"',
  'Shadow Weave Magic':'Section=ability,magic Note="-2 Wisdom","+1 DC and resistance checks on enchantment, illusion, necromancy, and darkness descriptor spells, -1 caster level on evocation and transmutation, no light descriptor spells"',
  'Signature Spell':'Section=magic Note="Convert arcane spells into specified mastered spell"',
  'Silver Palm':'Section=skill Note="+2 Appraise/+2 Bluff"',
  'Smooth Talk':'Section=skill Note="+2 Diplomacy/+2 Sense Motive"',
  'Snake Blood':'Section=save Note="+1 Reflex/+2 vs. poison"',
  'Spellcasting Prodigy (Bard)':'Section=magic Note="+1 spell DC/+2 charisma for bonus spells"',
  'Spellcasting Prodigy (Cleric)':'Section=magic Note="+1 spell DC/+2 wisdom for bonus spells"',
  'Spellcasting Prodigy (Druid)':'Section=magic Note="+1 spell DC/+2 wisdom for bonus spells"',
  'Spellcasting Prodigy (Sorcerer)':'Section=magic Note="+1 spell DC/+2 charisma for bonus spells"',
  'Spellcasting Prodigy (Wizard)':'Section=magic Note="+1 spell DC/+2 intelligence for bonus spells"',
  'Stealthy':'Section=skill Note="+2 Hide/+2 Move Silently"',
  'Street Smart':'Section=skill Note="+2 Bluff/+2 Gather Information"',
  'Strong Soul':'Section=save Note="+1 Fortitude/+1 Will/+1 vs. draining and death"',
  'Survivor':'Section=save,skill Note="+1 Fortitude","+2 Survival"',
  'Tattoo Focus':'Section=magic Note="+1 DC and caster level vs. resistance w/specialization school spells"',
  'Tenacious Magic':'Section=magic Note="Weave foes DC %V to dispel, DC 13+foe level to dispel Weave foes"',
  'Thug':'Section=combat,skill Note="+2 Initiative","+2 Intimidate"',
  'Thunder Twin':'Section=ability,skill Note="+2 charisma checks","DC 15 Wisdom check to determine direction of twin"',
  'Treetopper':'Section=skill Note="+2 Climb"',
  'Twin Spell':'Section=magic Note="Affect as two spells uses +4 spell slot"',
  'Twin Sword Style':'Section=combat Note="+2 AC vs. chosen foe when using two swords"',
  // Path
  'Advanced Illusionist':'Section=magic Note="+1 caster level illusion spells"',
  'Beguiling':'Section=skill Note="+2 Bluff"',
  'Compelling Magic':'Section=magic Note="+2 DC compulsion spells"',
  'Creator':'Section=magic,skill Note="+1 caster level creation spells","+2 chosen Craft"',
  'Detect Portal':'Section=skill Note="DC 20 Search to detect in/active portals"',
  'Disabling Touch':'Section=combat Note="Touch attack causes -2 Str and Dex for 1 min 1/dy"',
  'Familial Protection':'Section=magic Note="R10\' %V targets +4 AC for %1 rd 1/dy"',
  'Foreshadowed':'Section=combat Note="Always adds dexterity modifier to AC"',
  'Frenzy':'Section=combat Note="+%V (+%1 vs. dwarf/elf) smite damage 1/dy"',
  'Hammer Specialist':'Section=feature Note="+2 General Feat (Weapon Proficiency and Focus w/chosen hammer)"',
  'Insider Knowledge':'Section=magic Note="<i>Detect Thoughts</i> on 1 target for %V min 1/dy (Will neg)"',
  'Inspire Companions':'Section=magic Note="+2 allies\' attack, damage, skill, ability rolls for %V rd 1/dy"',
  'Mental Control':'Section=magic Note="Touch to allow target +%V on next Will save for 1 hr 1/dy"',
  'Rebound':'Section=combat Note="Recover 1d8+%V HP points when negative 1/dy"',
  'Reprisal':'Section=combat Note="Strike for max damage after foe hit 1/dy"',
  'Skilled Caster':'Section=skill Note="+2 Concentration/+2 Spellcraft"',
  'Stone Affinity':'Section=skill Note="+2 Search (stone, metal), automatic check w/in 10\'"',
  'Spurred':'Section=skill Note="+%V Climb, Hide, Jump, Move Silently for 10 min 1/dy"',
  'Stormfriend':'Section=save Note="Electricity resistance 5"',
  'Turn It On':'Section=ability Note="+4 charisma for 1 min 1/dy"',
  'Turn Lycanthropes':'Section=combat Note="Turn lycanthropes as undead"',
  'Turn Oozes':'Section=combat Note="Turn oozes as undead"',
  'Turn Reptiles':'Section=combat Note="Turn reptiles as undead"',
  'Turn Spiders':'Section=combat Note="Turn spiders as undead"',
  'Vicious Assault':'Section=combat Note="+2 attack, AC vs. one foe for 1 min 1/dy"',
  'Water Breathing':'Section=magic Note="Breathe water %V rd/dy"',
  'Wily':'Section=save Note="+2 saves vs. one foe for 1 min 1/dy"',
  // Race
  'Aasimar Ability Adjustment':'Section=ability Note="+2 Wisdom/+2 Charisma"',
  'Aasimar Alertness':'Section=skill Note="+2 Listen/Spot"',
  'Aasimar Level Adjustment':'Section=ability Note="-1 Level"',
  'Aasimar Resistance':'Section=save Note="5 vs. acid, cold, and electricity"',
  'Amphibious':'Section=feature Note="Breathe water at will"',
  'Aware':'Section=skill Note="+1 Listen/+1Spot"',
  'Air Genasi Ability Adjustment':'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Wisdom/-2 Charisma"',
  'Breathless':'Section=save Note="Immune drowning, suffocation, inhalation effects"',
  'Control Flame':'Section=magic Note="R10\' Shrink or expand natural fire for 5 min 1/dy"',
  'Deep Gnome Ability Adjustment':'Section=ability Note="-2 Strength/+2 Dexterity/+2 Wisdom/-4 Charisma"',
  'Deep Gnome Level Adjustment':'Section=ability Note="-3 Level"',
  'Drow Elf Ability Adjustment':'Section=ability Note="+2 Dexterity/-2 Constitution/+2 Intelligence/+2 Charisma"',
  'Drow Elf Level Adjustment':'Section=ability Note="-2 Level"',
  'Drow Spell Resistance':'Section=save Note="DC %V"',
  'Earth Genasi Ability Adjustment':'Section=ability Note="+2 Strength/+2 Constitution/-2 Wisdom/-2 Charisma"',
  'Elemental Affinity':'Section=save Note="+%V vs. %1 spells"',
  'Exceptional Dodge':'Section=combat Note="+4 AC"',
  'Extended Darkvision':'Section=feature Note="120\' b/w vision in darkness"',
  'Extra Luck':'Section=save Note="+2 Fortitude/+2 Reflex/+2 Will"',
  'Fire Genasi Ability Adjustment':'Section=ability Note="+2 Intelligence/-2 Charisma"',
  'Genasi Level Adjustment':'Section=ability Note="-1 Level"',
  'Gold Dwarf Ability Adjustment':'Section=ability Note="+2 Constitution/-2 Dexterity"',
  'Gold Dwarf Enmity':'Section=combat Note="+1 attack vs. aberrations"',
  'Gray Dwarf Ability Adjustment':'Section=ability Note="+2 Constitution/-4 Charisma"',
  'Grey Dwarf Level Adjustment':'Section=ability Note="-2 Level"',
  'Gray Dwarf Immunities':'Section=save Note="Immune to paralysis, phantasms, and magical and alchemaic poisons"',
  'Light Blindness':'Section=feature Note="Blind 1 rd from sudden daylight"',
  'Light Sensitivity':'Section=combat,save,skill Note="-2 attack in bright light","-2 saves in bright light","-2 checks in bright light"',
  'Native Outsider':'Section=save Note="Affected by outsider target spells, not humanoid"',
  'Natural Swimmer':'Section=ability Note="Swim 30\'"',
  'Noiseless':'Section=skill Note="+4 Move Silently"',
  'Sly':'Section=skill Note="+2 Hide"',
  'Shadowed':'Section=skill Note="+2 Hide in darkened underground areas"',
  'Sneaky':'Section=skill Note="+2 Hide"',
  'Speak Without Sound':'Section=feature Note="R20\' Telepathic communication"',
  'Strong Will':'Section=save Note="+2 Will vs. spells"',
  'Strongheart Feat Bonus':'Section=feature Note="+1 General Feat"',
  'Sun Elf Ability Adjustment':'Section=ability Note="+2 Intelligence/-2 Constitution"',
  'Svirfneblin Spell Resistance':'Section=save Note="DC %V"',
  'Tiefling Ability Adjustment':'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Charisma"',
  'Tiefling Level Adjustment':'Section=ability Note="-1 Level"',
  'Tiefling Resistance':'Section=save Note="5 vs. cold, electricity, and fire"',
  'Undetectable':'Section=magic Note="Continuous <i>Nondetection</i>"',
  'Water Genasi Ability Adjustment':'Section=ability Note="+2 Constitution/-2 Charisma"',
  'Wild Elf Ability Adjustment':'Section=ability Note="+2 Dexterity/-2 Intelligence"',
  'Wood Elf Ability Adjustment':'Section=ability Note="+2 Strength/+2 Dexterity/-2 Constitution/-2 Intelligence/-2 Charisma"'
};
Realms.FEATURES = Object.assign({}, SRD35.FEATURES, Realms.FEATURES_ADDED);
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
      '"1:Stone Affinity" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Cavern1:1=1,' +
      'Cavern2:3=1,' +
      'Cavern3:5=1,' +
      'Cavern4:7=1,' +
      'Cavern5:9=1,' +
      'Cavern6:11=1,' +
      'Cavern7:13=1,' +
      'Cavern8:15=1,' +
      'Cavern9:17=1 ' +
    'Spells=' +
      '"Cavern1:Detect Secret Doors",' +
      '"Cavern2:Darkness",' +
      '"Cavern3:Meld Into Stone",' +
      '"Cavern4:Secure Shelter",' +
      '"Cavern5:Passwall",' +
      '"Cavern6:Find The Path",' +
      '"Cavern7:Maw Of Stone",' +
      '"Cavern8:Earthquake",' +
      '"Cavern9:Imprisonment"',
  'Charm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn It On" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Charm1:1=1,' +
      'Charm2:3=1,' +
      'Charm3:5=1,' +
      'Charm4:7=1,' +
      'Charm5:9=1,' +
      'Charm6:11=1,' +
      'Charm7:13=1,' +
      'Charm8:15=1,' +
      'Charm9:17=1 ' +
    'Spells=' +
      '"Charm1:Charm Person",' +
      '"Charm2:Calm Emotions",' +
      '"Charm3:Suggestion",' +
      '"Charm4:Good Hope",' +
      '"Charm5:Charm Monster",' +
      '"Charm6:Geas/Quest",' +
      '"Charm7:Insanity",' +
      '"Charm8:Demand",' +
      '"Charm9:Dominate Monster"',
  'Craft Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Creator" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Craft1:1=1,' +
      'Craft2:3=1,' +
      'Craft3:5=1,' +
      'Craft4:7=1,' +
      'Craft5:9=1,' +
      'Craft6:11=1,' +
      'Craft7:13=1,' +
      'Craft8:15=1,' +
      'Craft9:17=1 ' +
    'Spells=' +
      '"Craft1:Animate Rope",' +
      '"Craft2:Wood Shape",' +
      '"Craft3:Stone Shape",' +
      '"Craft4:Minor Creation",' +
      '"Craft5:Wall Of Stone",' +
      '"Craft6:Fantastic Machine",' +
      '"Craft7:Major Creation",' +
      '"Craft8:Forcecage",' +
      '"Craft9:Greater Fantastic Machine"',
  'Darkness Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Blind-Fight" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Darkness1:1=1,' +
      'Darkness2:3=1,' +
      'Darkness3:5=1,' +
      'Darkness4:7=1,' +
      'Darkness5:9=1,' +
      'Darkness6:11=1,' +
      'Darkness7:13=1,' +
      'Darkness8:15=1,' +
      'Darkness9:17=1 ' +
    'Spells=' +
      '"Darkness1:Obscuring Mist",' +
      '"Darkness2:Blindness/Deafness",' +
      '"Darkness3:Blacklight",' +
      '"Darkness4:Armor Of Darkness",' +
      '"Darkness5:Darkbolt",' +
      '"Darkness6:Prying Eyes",' +
      '"Darkness7:Nightmare",' +
      '"Darkness8:Power Word Blind",' +
      '"Darkness9:Power Word Kill"',
  'Drow Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Lightning Reflexes" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Drow1:1=1,' +
      'Drow2:3=1,' +
      'Drow3:5=1,' +
      'Drow4:7=1,' +
      'Drow5:9=1,' +
      'Drow6:11=1,' +
      'Drow7:13=1,' +
      'Drow8:15=1,' +
      'Drow9:17=1 ' +
    'Spells=' +
      '"Drow1:Cloak Of Dark Power",' +
      '"Drow2:Clairaudience/Clairvoyance",' +
      '"Drow3:Suggestion",' +
      '"Drow4:Discern Lies",' +
      '"Drow5:Spiderform",' +
      '"Drow6:Greater Dispel Magic",' +
      '"Drow7:Word Of Chaos",' +
      '"Drow8:Greater Planar Ally",' +
      '"Drow9:Gate"',
  'Dwarf Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Great Fortitude" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Dwarf1:1=1,' +
      'Dwarf2:3=1,' +
      'Dwarf3:5=1,' +
      'Dwarf4:7=1,' +
      'Dwarf5:9=1,' +
      'Dwarf6:11=1,' +
      'Dwarf7:13=1,' +
      'Dwarf8:15=1,' +
      'Dwarf9:17=1 ' +
    'Spells=' +
      '"Dwarf1:Magic Weapon",' +
      '"Dwarf2:Bear\'s Endurance",' +
      '"Dwarf3:Glyph Of Warding",' +
      '"Dwarf4:Greater Magic Weapon",' +
      '"Dwarf5:Fabricate",' +
      '"Dwarf6:Stone Tell",' +
      '"Dwarf7:Dictum",' +
      '"Dwarf8:Protection From Spells",' +
      '"Dwarf9:Elemental Swarm"',
  'Elf Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Point-Blank Shot" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Elf1:1=1,' +
      'Elf2:3=1,' +
      'Elf3:5=1,' +
      'Elf4:7=1,' +
      'Elf5:9=1,' +
      'Elf6:11=1,' +
      'Elf7:13=1,' +
      'Elf8:15=1,' +
      'Elf9:17=1 ' +
    'Spells=' +
      '"Elf1:True Strike",' +
      '"Elf2:Cat\'s Grace",' +
      '"Elf3:Snare",' +
      '"Elf4:Tree Stride",' +
      '"Elf5:Commune With Nature",' +
      '"Elf6:Find The Path",' +
      '"Elf7:Liveoak",' +
      '"Elf8:Sunburst",' +
      '"Elf9:Antipathy"',
  'Family Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Familial Protection" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Family1:1=1,' +
      'Family2:3=1,' +
      'Family3:5=1,' +
      'Family4:7=1,' +
      'Family5:9=1,' +
      'Family6:11=1,' +
      'Family7:13=1,' +
      'Family8:15=1,' +
      'Family9:17=1 ' +
    'Spells=' +
      '"Family1:Bless",' +
      '"Family2:Shield Other",' +
      '"Family3:Helping Hand",' +
      '"Family4:Imbue With Spell Ability",' +
      '"Family5:Mnemonic Enhancer",' +
      '"Family6:Heroes\' Feast",' +
      '"Family7:Refuge",' +
      '"Family8:Protection From Spells",' +
      '"Family9:Prismatic Sphere"',
  'Fate Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Foreshadowed" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Fate1:1=1,' +
      'Fate2:3=1,' +
      'Fate3:5=1,' +
      'Fate4:7=1,' +
      'Fate5:9=1,' +
      'Fate6:11=1,' +
      'Fate7:13=1,' +
      'Fate8:15=1,' +
      'Fate9:17=1 ' +
    'Spells=' +
      '"Fate1:True Strike",' +
      '"Fate2:Augury",' +
      '"Fate3:Bestow Curse",' +
      '"Fate4:Status",' +
      '"Fate5:Mark Of Justice",' +
      '"Fate6:Geas/Quest",' +
      '"Fate7:Vision",' +
      '"Fate8:Mind Blank",' +
      '"Fate9:Foresight"',
  'Gnome Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Advanced Illusionist" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Gnome1:1=1,' +
      'Gnome2:3=1,' +
      'Gnome3:5=1,' +
      'Gnome4:7=1,' +
      'Gnome5:9=1,' +
      'Gnome6:11=1,' +
      'Gnome7:13=1,' +
      'Gnome8:15=1,' +
      'Gnome9:17=1 ' +
    'Spells=' +
      '"Gnome1:Silent Image",' +
      '"Gnome2:Gembomb",' +
      '"Gnome3:Minor Image",' +
      '"Gnome4:Minor Creation",' +
      '"Gnome5:Hallucinatory Terrain",' +
      '"Gnome6:Fantastic Machine",' +
      '"Gnome7:Screen",' +
      '"Gnome8:Irresistible Dance",' +
      '"Gnome9:Summon Nature\'s Ally IX"',
  'Halfling Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Spurred" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Halfling1:1=1,' +
      'Halfling2:3=1,' +
      'Halfling3:5=1,' +
      'Halfling4:7=1,' +
      'Halfling5:9=1,' +
      'Halfling6:11=1,' +
      'Halfling7:13=1,' +
      'Halfling8:15=1,' +
      'Halfling9:17=1 ' +
    'Spells=' +
      '"Halfling1:Magic Stone",' +
      '"Halfling2:Cat\'s Grace",' +
      '"Halfling3:Magic Vestment",' +
      '"Halfling4:Freedom Of Movement",' +
      '"Halfling5:Mage\'s Faithful Hound",' +
      '"Halfling6:Move Earth",' +
      '"Halfling7:Shadow Walk",' +
      '"Halfling8:Shadow Walk",' +
      '"Halfling9:Word Of Recall"',
  'Hatred Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Vicious Assault","1:Wily" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Hatred1:1=1,' +
      'Hatred2:3=1,' +
      'Hatred3:5=1,' +
      'Hatred4:7=1,' +
      'Hatred5:9=1,' +
      'Hatred6:11=1,' +
      'Hatred7:13=1,' +
      'Hatred8:15=1,' +
      'Hatred9:17=1 ' +
    'Spells=' +
      '"Hatred1:Doom",' +
      '"Hatred2:Scare",' +
      '"Hatred3:Bestow Curse",' +
      '"Hatred4:Crushing Despair",' +
      '"Hatred5:Righteous Might",' +
      '"Hatred6:Forbiddance",' +
      '"Hatred7:Blasphemy",' +
      '"Hatred8:Antipathy",' +
      '"Hatred9:Wail Of The Banshee"',
  'Illusion Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Advanced Illusionist" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Illusion1:1=1,' +
      'Illusion2:3=1,' +
      'Illusion3:5=1,' +
      'Illusion4:7=1,' +
      'Illusion5:9=1,' +
      'Illusion6:11=1,' +
      'Illusion7:13=1,' +
      'Illusion8:15=1,' +
      'Illusion9:17=1 ' +
    'Spells=' +
      '"Illusion1:Silent Image",' +
      '"Illusion2:Minor Image",' +
      '"Illusion3:Displacement",' +
      '"Illusion4:Phantasmal Killer",' +
      '"Illusion5:Persistent Image",' +
      '"Illusion6:Mislead",' +
      '"Illusion7:Project Image",' +
      '"Illusion8:Screen",' +
      '"Illusion9:Weird"',
  'Mentalism Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Mental Control" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Mentalism1:1=1,' +
      'Mentalism2:3=1,' +
      'Mentalism3:5=1,' +
      'Mentalism4:7=1,' +
      'Mentalism5:9=1,' +
      'Mentalism6:11=1,' +
      'Mentalism7:13=1,' +
      'Mentalism8:15=1,' +
      'Mentalism9:17=1 ' +
    'Spells=' +
      '"Mentalism1:Confusion",' +
      '"Mentalism2:Detect Thoughts",' +
      '"Mentalism3:Clairaudience/Clairvoyance",' +
      '"Mentalism4:Modify Memory",' +
      '"Mentalism5:Mind Fog",' +
      '"Mentalism6:Telepathic Bond",' +
      '"Mentalism7:Antipathy",' +
      '"Mentalism8:Mind Blank",' +
      '"Mentalism9:Astral Projection"',
  'Metal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Hammer Specialist" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Metal1:1=1,' +
      'Metal2:3=1,' +
      'Metal3:5=1,' +
      'Metal4:7=1,' +
      'Metal5:9=1,' +
      'Metal6:11=1,' +
      'Metal7:13=1,' +
      'Metal8:15=1,' +
      'Metal9:17=1 ' +
    'Spells=' +
      '"Metal1:Magic Weapon",' +
      '"Metal2:Heat Metal",' +
      '"Metal3:Keen Edge",' +
      '"Metal4:Rusting Grasp",' +
      '"Metal5:Wall Of Iron",' +
      '"Metal6:Blade Barrier",' +
      '"Metal7:Transmute Metal To Wood",' +
      '"Metal8:Iron Body",' +
      '"Metal9:Repel Metal Or Stone"',
  'Moon Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Lycanthropes" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Moon1:1=1,' +
      'Moon2:3=1,' +
      'Moon3:5=1,' +
      'Moon4:7=1,' +
      'Moon5:9=1,' +
      'Moon6:11=1,' +
      'Moon7:13=1,' +
      'Moon8:15=1,' +
      'Moon9:17=1 ' +
    'Spells=' +
      '"Moon1:Faerie Fire",' +
      '"Moon2:Moonbeam",' +
      '"Moon3:Moon Blade",' +
      '"Moon4:Rage",' +
      '"Moon5:Moon Path",' +
      '"Moon6:Permanent Image",' +
      '"Moon7:Insanity",' +
      '"Moon8:Animal Shapes",' +
      '"Moon9:Moonfire"',
  'Nobility Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Inspire Companions" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Nobility1:1=1,' +
      'Nobility2:3=1,' +
      'Nobility3:5=1,' +
      'Nobility4:7=1,' +
      'Nobility5:9=1,' +
      'Nobility6:11=1,' +
      'Nobility7:13=1,' +
      'Nobility8:15=1,' +
      'Nobility9:17=1 ' +
    'Spells=' +
      '"Nobility1:Divine Favor",' +
      '"Nobility2:Enthrall",' +
      '"Nobility3:Magic Vestment",' +
      '"Nobility4:Discern Lies",' +
      '"Nobility5:Greater Command",' +
      '"Nobility6:Geas/Quest",' +
      '"Nobility7:Repulsion",' +
      '"Nobility8:Demand",' +
      '"Nobility9:Storm Of Vengeance"',
  'Ocean Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Water Breathing" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Ocean1:1=1,' +
      'Ocean2:3=1,' +
      'Ocean3:5=1,' +
      'Ocean4:7=1,' +
      'Ocean5:9=1,' +
      'Ocean6:11=1,' +
      'Ocean7:13=1,' +
      'Ocean8:15=1,' +
      'Ocean9:17=1 ' +
    'Spells=' +
      '"Ocean1:Endure Elements",' +
      '"Ocean2:Sound Burst",' +
      '"Ocean3:Water Breathing",' +
      '"Ocean4:Freedom Of Movement",' +
      '"Ocean5:Wall Of Ice",' +
      '"Ocean6:Freezing Sphere",' +
      '"Ocean7:Waterspout",' +
      '"Ocean8:Maelstrom",' +
      '"Ocean9:Elemental Swarm"',
  'Orc Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Frenzy" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Orc1:1=1,' +
      'Orc2:3=1,' +
      'Orc3:5=1,' +
      'Orc4:7=1,' +
      'Orc5:9=1,' +
      'Orc6:11=1,' +
      'Orc7:13=1,' +
      'Orc8:15=1,' +
      'Orc9:17=1 ' +
    'Spells=' +
      '"Orc1:Cause Fear",' +
      '"Orc2:Produce Flame",' +
      '"Orc3:Prayer",' +
      '"Orc4:Divine Power",' +
      '"Orc5:Prying Eyes",' +
      '"Orc6:Eyebite",' +
      '"Orc7:Blasphemy",' +
      '"Orc8:Cloak Of Chaos",' +
      '"Orc9:Power Word Kill"',
  'Planning Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Extend Spell" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Planning1:1=1,' +
      'Planning2:3=1,' +
      'Planning3:5=1,' +
      'Planning4:7=1,' +
      'Planning5:9=1,' +
      'Planning6:11=1,' +
      'Planning7:13=1,' +
      'Planning8:15=1,' +
      'Planning9:17=1 ' +
    'Spells=' +
      '"Planning1:Deathwatch",' +
      '"Planning2:Augury",' +
      '"Planning3:Clairaudience/Clairvoyance",' +
      '"Planning4:Status",' +
      '"Planning5:Detect Scrying",' +
      '"Planning6:Heroes\' Feast",' +
      '"Planning7:Greater Scrying",' +
      '"Planning8:Discern Location",' +
      '"Planning9:Time Stop"',
  'Portal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Detect Portal" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Portal1:1=1,' +
      'Portal2:3=1,' +
      'Portal3:5=1,' +
      'Portal4:7=1,' +
      'Portal5:9=1,' +
      'Portal6:11=1,' +
      'Portal7:13=1,' +
      'Portal8:15=1,' +
      'Portal9:17=1 ' +
    'Spells=' +
      '"Portal1:Summon Monster I",' +
      '"Portal2:Analyze Portal",' +
      '"Portal3:Dimensional Anchor",' +
      '"Portal4:Dimension Door",' +
      '"Portal5:Teleport",' +
      '"Portal6:Banishment",' +
      '"Portal7:Etherealness",' +
      '"Portal8:Maze",' +
      '"Portal9:Gate"',
  'Renewal Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Rebound" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Renewal1:1=1,' +
      'Renewal2:3=1,' +
      'Renewal3:5=1,' +
      'Renewal4:7=1,' +
      'Renewal5:9=1,' +
      'Renewal6:11=1,' +
      'Renewal7:13=1,' +
      'Renewal8:15=1,' +
      'Renewal9:17=1 ' +
    'Spells=' +
      '"Renewal1:Charm Person",' +
      '"Renewal2:Lesser Restoration",' +
      '"Renewal3:Remove Disease",' +
      '"Renewal4:Reincarnate",' +
      '"Renewal5:Atonement",' +
      '"Renewal6:Heroes\' Feast",' +
      '"Renewal7:Greater Restoration",' +
      '"Renewal8:Polymorph Any Object",' +
      '"Renewal9:Freedom"',
  'Retribution Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Reprisal" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Retribution1:1=1,' +
      'Retribution2:3=1,' +
      'Retribution3:5=1,' +
      'Retribution4:7=1,' +
      'Retribution5:9=1,' +
      'Retribution6:11=1,' +
      'Retribution7:13=1,' +
      'Retribution8:15=1,' +
      'Retribution9:17=1 ' +
    'Spells=' +
      '"Retribution1:Shield Of Faith",' +
      '"Retribution2:Bear\'s Endurance",' +
      '"Retribution3:Speak With Dead",' +
      '"Retribution4:Fire Shield",' +
      '"Retribution5:Mark Of Justice",' +
      '"Retribution6:Banishment",' +
      '"Retribution7:Spell Turning",' +
      '"Retribution8:Discern Location",' +
      '"Retribution9:Storm Of Vengeance"',
  'Rune Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Scribe Scroll" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Rune1:1=1,' +
      'Rune2:3=1,' +
      'Rune3:5=1,' +
      'Rune4:7=1,' +
      'Rune5:9=1,' +
      'Rune6:11=1,' +
      'Rune7:13=1,' +
      'Rune8:15=1,' +
      'Rune9:17=1 ' +
    'Spells=' +
      '"Rune1:Erase",' +
      '"Rune2:Secret Page",' +
      '"Rune3:Glyph Of Warding",' +
      '"Rune4:Explosive Runes",' +
      '"Rune5:Lesser Planar Binding",' +
      '"Rune6:Greater Glyph Of Warding",' +
      '"Rune7:Instant Summons",' +
      '"Rune8:Symbol Of Death",' +
      '"Rune9:Teleportation Circle"',
  'Scalykind Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Reptiles" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Scalykind1:1=1,' +
      'Scalykind2:3=1,' +
      'Scalykind3:5=1,' +
      'Scalykind4:7=1,' +
      'Scalykind5:9=1,' +
      'Scalykind6:11=1,' +
      'Scalykind7:13=1,' +
      'Scalykind8:15=1,' +
      'Scalykind9:17=1 ' +
    'Spells=' +
      '"Scalykind1:Magic Fang",' +
      '"Scalykind2:Animal Trance",' +
      '"Scalykind3:Greater Magic Fang",' +
      '"Scalykind4:Poison",' +
      '"Scalykind5:Animal Growth",' +
      '"Scalykind6:Eyebite",' +
      '"Scalykind7:Creeping Doom",' +
      '"Scalykind8:Animal Shapes",' +
      '"Scalykind9:Shapechange"',
  'Slime Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Oozes" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Slime1:1=1,' +
      'Slime2:3=1,' +
      'Slime3:5=1,' +
      'Slime4:7=1,' +
      'Slime5:9=1,' +
      'Slime6:11=1,' +
      'Slime7:13=1,' +
      'Slime8:15=1,' +
      'Slime9:17=1 ' +
    'Spells=' +
      '"Slime1:Grease",' +
      '"Slime2:Acid Arrow",' +
      '"Slime3:Poison",' +
      '"Slime4:Rusting Grasp",' +
      '"Slime5:Black Tentacles",' +
      '"Slime6:Transmute Rock To Mud",' +
      '"Slime7:Destruction",' +
      '"Slime8:Power Word Blind",' +
      '"Slime9:Implosion"',
  'Spell Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Skilled Caster" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Spell1:1=1,' +
      'Spell2:3=1,' +
      'Spell3:5=1,' +
      'Spell4:7=1,' +
      'Spell5:9=1,' +
      'Spell6:11=1,' +
      'Spell7:13=1,' +
      'Spell8:15=1,' +
      'Spell9:17=1 ' +
    'Spells=' +
      '"Spell1:Mage Armor",' +
      '"Spell2:Silence",' +
      '"Spell3:Anyspell",' +
      '"Spell4:Mnemonic Enhancer",' +
      '"Spell5:Break Enchantment",' +
      '"Spell6:Greater Anyspell",' +
      '"Spell7:Limited Wish",' +
      '"Spell8:Antimagic Field",' +
      '"Spell9:Mage\'s Disjunction"',
  'Spider Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn Spiders" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Spider1:1=1,' +
      'Spider2:3=1,' +
      'Spider3:5=1,' +
      'Spider4:7=1,' +
      'Spider5:9=1,' +
      'Spider6:11=1,' +
      'Spider7:13=1,' +
      'Spider8:15=1,' +
      'Spider9:17=1 ' +
    'Spells=' +
      '"Spider1:Spider Climb",' +
      '"Spider2:Summon Swarm",' +
      '"Spider3:Phantom Steed",' +
      '"Spider4:Giant Vermin",' +
      '"Spider5:Insect Plague",' +
      '"Spider6:Spider Curse",' +
      '"Spider7:Stone Spiders",' +
      '"Spider8:Creeping Doom",' +
      '"Spider9:Spider Shapes"',
  'Storm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Stormfriend" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Storm1:1=1,' +
      'Storm2:3=1,' +
      'Storm3:5=1,' +
      'Storm4:7=1,' +
      'Storm5:9=1,' +
      'Storm6:11=1,' +
      'Storm7:13=1,' +
      'Storm8:15=1,' +
      'Storm9:17=1 ' +
    'Spells=' +
      '"Storm1:Entropic Shield",' +
      '"Storm2:Gust Of Wind",' +
      '"Storm3:Call Lightning",' +
      '"Storm4:Sleet Storm",' +
      '"Storm5:Ice Storm",' +
      '"Storm6:Summon Monster VI",' +
      '"Storm7:Control Weather",' +
      '"Storm8:Whirlwind",' +
      '"Storm9:Storm Of Vengeance"',
  'Suffering Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Disabling Touch" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Suffering1:1=1,' +
      'Suffering2:3=1,' +
      'Suffering3:5=1,' +
      'Suffering4:7=1,' +
      'Suffering5:9=1,' +
      'Suffering6:11=1,' +
      'Suffering7:13=1,' +
      'Suffering8:15=1,' +
      'Suffering9:17=1 ' +
    'Spells=' +
      '"Suffering1:Bane",' +
      '"Suffering2:Bear\'s Endurance",' +
      '"Suffering3:Bestow Curse",' +
      '"Suffering4:Enervation",' +
      '"Suffering5:Feeblemind",' +
      '"Suffering6:Harm",' +
      '"Suffering7:Eyebite",' +
      '"Suffering8:Symbol Of Pain",' +
      '"Suffering9:Horrid Wilting"',
  'Time Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Improved Initiative" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Time1:1=1,' +
      'Time2:3=1,' +
      'Time3:5=1,' +
      'Time4:7=1,' +
      'Time5:9=1,' +
      'Time6:11=1,' +
      'Time7:13=1,' +
      'Time8:15=1,' +
      'Time9:17=1 ' +
    'Spells=' +
      '"Time1:True Strike",' +
      '"Time2:Gentle Repose",' +
      '"Time3:Haste",' +
      '"Time4:Freedom Of Movement",' +
      '"Time5:Permanency",' +
      '"Time6:Contingency",' +
      '"Time7:Instant Summons",' +
      '"Time8:Foresight",' +
      '"Time9:Time Stop"',
  'Trade Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Insider Knowledge" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Trade1:1=1,' +
      'Trade2:3=1,' +
      'Trade3:5=1,' +
      'Trade4:7=1,' +
      'Trade5:9=1,' +
      'Trade6:11=1,' +
      'Trade7:13=1,' +
      'Trade8:15=1,' +
      'Trade9:17=1 ' +
    'Spells=' +
      '"Trade1:Detect Thoughts;Message",' +
      '"Trade2:Gembomb",' +
      '"Trade3:Eagle\'s Splendor",' +
      '"Trade4:Sending",' +
      '"Trade5:Fabricate",' +
      '"Trade6:True Seeing",' +
      '"Trade7:Mage\'s Magnificent Mansion",' +
      '"Trade8:Mind Blank",' +
      '"Trade9:Discern Location"',
  'Tyranny Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Compelling Magic" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Tyranny1:1=1,' +
      'Tyranny2:3=1,' +
      'Tyranny3:5=1,' +
      'Tyranny4:7=1,' +
      'Tyranny5:9=1,' +
      'Tyranny6:11=1,' +
      'Tyranny7:13=1,' +
      'Tyranny8:15=1,' +
      'Tyranny9:17=1 ' +
    'Spells=' +
      '"Tyranny1:Command",' +
      '"Tyranny2:Enthrall",' +
      '"Tyranny3:Discern Lies",' +
      '"Tyranny4:Fear",' +
      '"Tyranny5:Greater Command",' +
      '"Tyranny6:Geas/Quest",' +
      '"Tyranny7:Grasping Hand",' +
      '"Tyranny8:Mass Charm Monster",' +
      '"Tyranny9:Dominate Monster"',
  'Undeath Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Extra Turning" ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Undeath1:1=1,' +
      'Undeath2:3=1,' +
      'Undeath3:5=1,' +
      'Undeath4:7=1,' +
      'Undeath5:9=1,' +
      'Undeath6:11=1,' +
      'Undeath7:13=1,' +
      'Undeath8:15=1,' +
      'Undeath9:17=1 ' +
    'Spells=' +
      '"Undeath1:Detect Undead",' +
      '"Undeath2:Desecrate",' +
      '"Undeath3:Animate Dead",' +
      '"Undeath4:Death Ward",' +
      '"Undeath5:Mass Inflict Light Wounds",' +
      '"Undeath6:Create Undead",' +
      '"Undeath7:Control Undead",' +
      '"Undeath8:Create Greater Undead",' +
      '"Undeath9:Energy Drain"'
};
Realms.PATHS = Object.assign({}, SRD35.PATHS, Realms.PATHS_ADDED);
Realms.RACES = {
  'Gold Dwarf':
    SRD35.RACES['Dwarf']
      .replace('Dwarf Ability', 'Gold Dwarf Ability')
      .replace('Dwarf Enmity', 'Gold Dwarf Enmity'),
  'Gray Dwarf':
    'Features=' +
        '"1:Weapon Familiarity (Dwarven Urgosh/Dwarven Waraxe)",' +
        '1:Aware,"1:Dwarf Armor Speed Adjustment","1:Dwarf Enmity",' +
        '"1:Extended Darkvision","1:Gray Dwarf Ability Adjustment",' +
        '"1:Gray Dwarf Immunities","1:Grey Dwarf Level Adjustment",' +
        '"1:Know Depth","1:Light Sensitivity","1:Natural Smith",1:Noiseless,' +
        '"1:Resist Poison","1:Resist Spells",1:Slow,1:Stability,' +
        '1:Stonecunning ' +
    'Languages=Undercommon,Dwarven ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Duergaren1:1=1,' +
      'Duergaren2:1=1 ' +
    'Spells=' +
      '"Duergaren1:Enlarge Person",' +
      'Duergaren2:Invisibility',
  'Shield Dwarf':
    SRD35.RACES['Dwarf'],
  'Drow Elf':
    'Features=' +
      '"1:Weapon Proficiency (Hand Crossbow/Light Crossbow/Rapier/Shortsword)",' +
      '"1:Drow Elf Ability Adjustment","1:Drow Elf Level Adjustment",' +
      '"1:Drow Spell Resistance","1:Extended Darkvision","1:Keen Senses",' +
      '"1:Light Blindness","1:Light Sensitivity","1:Resist Enchantment",' +
      '"1:Sense Secret Doors","1:Sleep Immunity","1:Stong Will" ' +
    'Languages=Undercommon,Elven ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      '"Drowen0:1=1",' +
      '"Drowen1:1=1",' +
      '"Drowen2:1=1" ' +
    'Spells=' +
      '"Drowen0:Dancing Lights",' +
      '"Drowen1:Faerie Fire",' +
      '"Drowen2:Darkness"',
  'Moon Elf':
    SRD35.RACES['Elf'],
  'Sun Elf':
    SRD35.RACES['Elf'].replace('Elf Ability', 'Sun Elf Ability'),
  'Wild Elf':
    SRD35.RACES['Elf'].replace('Elf Ability', 'Wild Elf Ability'),
  'Wood Elf':
    SRD35.RACES['Elf'].replace('Elf Ability', 'Wood Elf Ability'),
  'Deep Gnome':
    'Features=' +
      '"1:Deep Gnome Ability Adjustment","1:Deep Gnome Level Adjustment",' +
      '"1:Exceptional Dodge","1:Extended Darkvision","1:Extra Luck",' +
      '"1:Gnome Enmity","1:Keen Ears","1:Resist Fear",1:Shadowed,1:Slow,' +
      '1:Small,1:Sneaky,1:Stonecunning,"1:Svirfneblin Spell Resistance",' +
      '1:Undetectable ' +
    'Languages=Undercommon,Gnome ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Svirfneblinish2:1=3,' +
      'Svirfneblinish3:1=1 ' +
    'Spells=' +
      '"Svirfneblinish2:Alter Self;Blindness/Deafness;Blur",' +
      'Svirfneblinish3:Nondetection',
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
      .replace('Fortunate', '"Strongheart Feat Bonus"'),
  'Human':
    SRD35.RACES['Human'],
  'Aasimar':
    'Features=' +
      '"1:Aasimar Ability Adjustment","1:Aasimar Alertness",' +
      '"1:Aasimar Level Adjustment","1:Aasimar Resistance",1:Darkvision,' +
      '"1:Native Outsider" ' +
    'Languages=Common ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Aasimaren0:1=1 ' +
    'Spells=' +
      'Aasimaren0:Light',
  'Air Genasi':
    'Features=' +
      '"1:Air Genasi Ability Adjustment",1:Breathless,1:Darkvision,' +
      '"1:Elemental Affinity","1:Genasi Level Adjustment",' +
      '"1:Native Outsider" ' +
    'Languages=Common ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Airen2:1=1 ' +
    'Spells=' +
      'Airen2:Levitate',
  'Earth Genasi':
    'Features=' +
      '1:Darkvision,"1:Earth Genasi Ability Adjustment",' +
      '"1:Elemental Affinity","1:Genasi Level Adjustment",' +
      '"1:Native Outsider" ' +
    'Languages=Common ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Earthen1:1=1 ' +
    'Spells=' +
      '"Earthen1:Pass Without Trace"',
  'Fire Genasi':
    'Features=' +
      '"1:Control Flame",1:Darkvision,"1:Elemental Affinity",' +
      '"1:Fire Genasi Ability Adjustment","1:Genasi Level Adjustment",' +
      '"1:Native Outsider" ' +
    'Languages=Common',
  'Water Genasi':
    'Features=' +
      '1:Amphibious,1:Darkvision,"1:Elemental Affinity",' +
      '"1:Genasi Level Adjustment","1:Native Outsider","1:Natural Swimmer",' +
      '"1:Water Genasi Ability Adjustment" ' +
    'Languages=Common ' +
    'SpellAbility=wisdom ' +
    'SpellSlots=' +
      'Wateren0:1=1 ' +
    'Spells=' +
      '"Wateren0:Create Water"',
  'Tiefling':
    'Features=' +
      '1:Beguiling,1:Darkvision,"1:Native Outsider",1:Sneaky,' +
      '"1:Tiefling Ability Adjustment","1:Tiefling Level Adjustment",' +
      '"1:Tiefling Resistance" ' +
    'Languages=Common ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Tieflen2:1=1 ' +
    'Spells=' +
      'Tieflen2:Darkness'
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
  'Half Elf':'',
  'Half Orc':'',
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
    'Description="5\'w by $RS\'l flame ${Math.min(5,Math.floor(lvl/2))}d8 HP (Ref half)"',
  'Analyze Portal':
    'School=Divination ' +
    'Description="R60\' cone info on portals for $L rd"',
  'Anyspell':
    'School=Transmutation ' +
    'Description="Self prepare up to 2nd level arcane spell from written source"',
  'Armor Of Darkness':
    'School=Abjuration ' +
    'Description="Touched +${Math.min(8,Math.floor(lvl/4)+3)} AC, darkvision for $L10 min"',
  'Blacklight':
    'School=Evocation ' +
    'Description="R$RS\' Target center 20\' radius darkness only caster can see within for $L rd (Will neg)"',
  'Claws Of Darkness':
    'School=Illusion ' +
    'Description="Self hands become 6\' extendable claws 1d4 HP cold and slow when grappling (Fort neg) for $L rd"',
  'Cloak Of Dark Power':
    'School=Abjuration ' + 'Description="Touched protected from sunlight, +4 save vs. light and dark for $L min"',
  'Create Magic Tatoo':
    'School=Conjuration ' +
    'Description="Touched gains tatoo w/variable effects for 1 dy"',
  'Darkbolt':
    'School=Evocation ' +
    'Description="R$RM\' ${Math.min(Math.floor(lvl/2),7)} ranged touch bolts 2d8 HP, dazed (Will neg)"',
  "Elminster's Evasion":
    'School=Evocation ' +
    'Description="Self and up to 50 lb teleport to named locale"',
  'Fantastic Machine':
    'School=Illusion ' +
    'Description="Lg machine (HP 22, AC 14, slam +5 1d8+4, rock +3 2d6+4, load 230) obeys commands for $L min"',
  'Fire Stride':
    'School=Transmutation ' +
    'Description="Self teleport $RL\' between fires $L times for $L10 min"',
  'Flashburst':
    'School=Evocation ' +
    'Description="R$RL\' Targets in 20\' radius dazzled, all w/in 120\' blinded (Will neg) for 2d8 rd"',
  'Flensing':
    'School=Evocation ' +
    'Description="R$RS\' Target 2d6 HP (Fort half), lose 1d6 Cha and Con (Fort neg) for 4 rd"',
  'Gate Seal':
    'School=Abjuration ' +
    'Description="R$RS\' seal target gate or portal"',
  'Gembomb':
    'School=Conjuration ' +
    'Description="Up to 5 gems become R100\' ranged touch bombs totalling ${Math.min(5,Math.floor(lvl/2))}d8 HP (Ref half)"',
  'Great Shout':
    'School=Evocation ' +
    'Description="R$RS\' Objects in range 20d6 HP (Ref neg), creatures in cone 10d6 HP, stunned 1 rd, deaf 4d6 rd (Fort half)"',
  'Greater Anyspell':
    'School=Transmutation ' +
    'Description="Self prepare up to 5th level arcane spell from written source"',
  'Greater Fantastic Machine':
    'School=Illusion ' +
    'Description="Lg machine (HP 88, AC 20, slam +17,+12 1d8+9, rock +12,+7 2d6+9, load 520) obeys commands for $L min"',
  "Grimwald's Graymantle":
    'School=Necromancy ' +
    'Description="R$RM\' Target prevented from heal, restore, regen for $L rd (Fort neg)"',
  'Lesser Ironguard':
    'School=Abjuration ' +
    'Description="Touched unaffected by normal metal for $L rd"',
  'Maelstrom':
    'School=Conjuration ' +
    'Description="R$RL\' Targets in whirpool 3d8 HP for 2d4 rd (Ref et al neg) for $L rd"',
  'Maw Of Stone':
    'School=Transmutation ' +
    'Description="Animated opening can attack and grapple"',
  'Moon Blade':
    'School=Evocation ' +
    'Description="Moonlight blade touch attack 1d8+$Ldiv2 HP (undead 2d8+$L HP) for $L min"',
  'Moon Path':
    'School=Evocation ' +
    'Description="Glowing pathway 5\'-20\'w by $L15\'l for $L min; <i>Sanctuary</i> on path for $L designed"',
  'Moonbeam':
    'School=Evocation ' +
    'Description="R$RS\' Target lycanthropes become animal for $L min (Will neg)"',
  'Moonfire':
    'School=Evocation ' +
    'Description="R$RS\' Cone ${Math.min(Math.floor(lvl/2),10)}d8 HP (undead x2) (Ref half), changed creatures revert (Will neg), marks auras for $L min"',
  'Scatterspray':
    'School=Transmutation ' +
    'Description="R$RS\' Little items w/in 1\' radius scatter; creatures w/in 10\' 1d8 HP (Ref neg)"',
  'Shadow Mask':
    'School=Illusion ' +
    'Description="Self face hidden, +4 save vs. light and dark, 50% gaze attack for $L10 min"',
  'Shadow Spray':
    'School=Illusion ' +
    'Description="R$RM\' Creatures in 5\' radius lose 2 Str, dazed 1 rd, -2 fear saves for $L rd (Fort neg)"',
  "Snilloc's Snowball Swarm":
    'School=Evocation ' +
    'Description="R$RM\' Creatures in 10\' radius ${Math.min(2+Math.floor((lvl-3)/2),5)}d6 HP cold (Ref half)"',
  'Spider Curse':
    'School=Transmutation ' +
    'Description="R$RM\' Target polymorph to dominated drider for $L dy (Will neg)"',
  'Spider Shapes':
    'School=Transmutation ' +
    'Description="R$RS\' Willing target polymorph to monstrous spider for $L hr"',
  'Spiderform':
    'School=Transmutation ' +
    'Description="Self polymorph to drider or monstrous spider for $L hr"',
  'Stone Spiders':
    'School=Transmutation ' +
    'Description="R$RS\' Transform 1d3 pebbles into controlled monstrous spiders for $L rd"',
  'Thunderlance':
    'School=Evocation ' +
    'Description="Self wield shimmering staff (+${Math.floor(1+lvl/2)} 2d6+${Math.floor(1+lvl/2)} x3@20) 1\'-20\' long for $L rd"',
  'Waterspout':
    'School=Conjuration ' +
    'Description="R$RL\' 10\'w by 80\'h spout moves 30\'/rd, touched creatures 2d6 HP (Ref neg) for $L rd"'
};
Realms.CLASS_SPELLS_ADDED = {
  'Bard':
    '"B2:Eagle\'s Splendor",' +
    '"B3:Analyze Portal",' +
    '"B6:Gate Seal;Great Shout"',
  'Cleric':
    '"C6:Gate Seal"',
  'Druid':
    '"D6:Gate Seal"',
  'Wizard':
    'W1:Scatterspray,' +
    '"W2:Aganazzar\'s Scorcher;Claws Of Darkness;Create Magic Tatoo;' +
    'Eagle\'s Splendor;Shadow Mask;Shadow Spray;Snilloc\'s Snowball Swarm",' +
    '"W3:Analyze Portal;Blacklight;Flashburst",' +
    '"W4:Fire Stride;Thunderlance",' +
    '"W5:Grimwald\'s Graymantle;Lesser Ironguard",' +
    '"W6:Gate Seal",' +
    '"W8:Flensing;Great Shout",' +
    '"W9:Elminster\'s Evasion"'
};
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
  Realms.baseRules.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
Realms.aideRules = function(rules, companions, familiars) {
  Realms.baseRules.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to combat. */
Realms.combatRules = function(rules, armors, shields, weapons) {
  Realms.baseRules.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines the rules related to goodies included in character notes. */
Realms.goodiesRules = function(rules) {
  Realms.baseRules.goodiesRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
Realms.identityRules = function(
  rules, alignments, classes, deities, paths, races, regions
) {

  QuilvynUtils.checkAttrTable(regions, []);

  if(Realms.baseRules == window.Pathfinder)
    Pathfinder.identityRules(
      rules, alignments, classes, deities, {}, paths, races, Pathfinder.TRACKS,
      Pathfinder.TRAITS
    );
  else
    SRD35.identityRules(rules, alignments, classes, deities, paths, races)
  // No changes needed to the rules defined by base method

  for(var region in regions) {
    rules.choiceRules(rules, 'Region', region, regions[region]);
  }

  rules.defineEditorElement
    ('region', 'Region', 'select-one', 'regions', 'experience');
  rules.defineSheetElement('Region', 'Alignment');

  rules.defineChoice('notes',
    'validationNotes.regionRace:Racial region requires equivalent race'
  );
  rules.defineRule('level', '', '^', '1');
  /* TBD
  rules.defineRule('validationNotes.regionRace',
    'region', '=', 'Realms.RACES[source] == null ? ' +
                   'null : -QuilvynUtils.findElement(Realms.RACES, source)',
    'race', '+', 'QuilvynUtils.findElement(Realms.RACES, source)'
  );
  */

};

/* Defines rules related to magic use. */
Realms.magicRules = function(rules, schools, spells) {
  Realms.baseRules.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character feats, languages, and skills. */
Realms.talentRules = function(rules, feats, features, languages, skills) {
  Realms.baseRules.talentRules(rules, feats, features, languages, skills);
  // No changes needed to the rules defined by base method
  for(var feat in feats) {
    if(feats[feat].indexOf('Item Creation') >= 0)
      rules.defineRule('SumItemCreationFeats', 'feats.' + feat, '+=', null);
    if(feats[feat].indexOf('Metamagic') >= 0)
      rules.defineRule('SumMetamagicFeats', 'feats.' + feat, '+=', null);
  }
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
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'Armor')
    Realms.armorRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'AC'),
      QuilvynUtils.getAttrValue(attrs, 'Weight'),
      QuilvynUtils.getAttrValue(attrs, 'Dex'),
      QuilvynUtils.getAttrValue(attrs, 'Skill'),
      QuilvynUtils.getAttrValue(attrs, 'Spell')
    );
  else if(type == 'Class') {
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
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Realms.SPELLS
    );
    if(Realms.baseRules.classRulesExtra)
      Realms.baseRules.classRulesExtra(rules, name);
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
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Size')
    );
  else if(type == 'Feat') {
    Realms.featRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Imply'),
      QuilvynUtils.getAttrValueArray(attrs, 'Type')
    );
    Realms.featRulesExtra(rules, name, Realms.SPELLS);
  } else if(type == 'Feature')
     Realms.featureRules(rules, name,
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Realms.SPELLS
    );
    Realms.pathRulesExtra(rules, name);
  } else if(type == 'Race') {
    Realms.raceRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Require'),
      QuilvynUtils.getAttrValueArray(attrs, 'Features'),
      QuilvynUtils.getAttrValueArray(attrs, 'Selectables'),
      QuilvynUtils.getAttrValueArray(attrs, 'Languages'),
      QuilvynUtils.getAttrValue(attrs, 'SpellAbility'),
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots'),
      QuilvynUtils.getAttrValueArray(attrs, 'Spells'),
      Realms.SPELLS
    );
    Realms.raceRulesExtra(rules, name);
  } else if(type == 'Region')
    Realms.regionRules(rules, name);
  else if(type == 'School') {
    Realms.schoolRules(rules, name,
      QuilvynUtils.getAttrValueArray(attrs, 'Features')
    );
    if(Realms.baseRules.schoolRulesExtra)
      Realms.baseRules.schoolRulesExtra(rules, name);
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
    if(Realms.baseRules.skillRulesExtra)
      Realms.baseRules.skillRulesExtra(rules, name);
  } else if(type == 'Spell')
    Realms.spellRules(rules, name,
      QuilvynUtils.getAttrValue(attrs, 'School'),
      QuilvynUtils.getAttrValue(attrs, 'Group'),
      QuilvynUtils.getAttrValue(attrs, 'Level'),
      QuilvynUtils.getAttrValue(attrs, 'Description')
    );
  else if(type == 'Track')
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
  if(type != 'Feature' && type != 'Path') {
    type = type == 'Class' ? 'levels' :
    type = type == 'Deity' ? 'deities' :
    (type.substring(0,1).toLowerCase() + type.substring(1).replace(/ /g, '') + 's');
    rules.addChoice(type, name, attrs);
  }
};

/* Defines in #rules# the rules associated with alignment #name#. */
Realms.alignmentRules = function(rules, name) {
  Realms.baseRules.alignmentRules(rules, name);
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
  Realms.baseRules.armorRules
    (rules, name, ac, weight, maxDex, skillPenalty, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with class #name#, which has the list
 * of hard prerequisites #requires# and soft prerequisites #implies#. The class
 * grants #hitDie# (format [n]'d'n) additional hit points and #skillPoints#
 * additional skill points with each level advance. #attack# is one of '1',
 * '1/2', or '3/4', indicating the base attack progression for the class;
 * similarly, #saveFort#, #saveRef#, and #saveWill# are each one of '1/2' or
 * '1/3', indicating the saving throw progressions. #skills# indicate class
 * skills for the class; see skillRules for an alternate way these can be
 * defined. #features# and #selectables# list the fixed and selectable features
 * acquired as the character advances in class level, and #languages# list any
 * automatic languages for the class. #casterLevelArcane# and
 * #casterLevelDivine#, if specified, give the Javascript expression for
 * determining the caster level for the class; these can incorporate a class
 * level attribute (e.g., 'levels.Fighter') or the character level attribute
 * 'level'. #spellAbility#, if specified, contains the ability for computing
 * spell difficulty class for cast spells. #spellSlots# lists the number of
 * spells per level per day that the class can cast, and #spells# lists spells
 * defined by the class.
 */
Realms.classRules = function(
  rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
  saveWill, skills, features, selectables, languages, casterLevelArcane,
  casterLevelDivine, spellAbility, spellSlots, spells, spellDict
) {
  if(Realms.baseRules == window.Pathfinder) {
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
  Realms.baseRules.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots, spells, spellDict
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with animal companion #name#, which
 * has abilities #str#, #dex#, #con#, #intel#, #wis#, and #cha#, hit dice #hd#,
 * and armor class #ac#. The companion has attack bonus #attack# and does
 * #damage# damage. If specified, #level# indicates the minimum master level
 * the character needs to have this animal as a companion.
 */
Realms.companionRules = function(
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, level, size
) {
  Realms.baseRules.companionRules(
    rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level
  );
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with deity #name#. #alignment# gives
 * the deity's alignment, and #domains# and #weapons# list the associated
 * domains and favored weapons.
 */
Realms.deityRules = function(rules, name, alignment, domains, weapons) {
  Realms.baseRules.deityRules(rules, name, alignment, domains, weapons);
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
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, level, size
) {
  Realms.baseRules.familiarRules
    (rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size, level);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name#. #require# and
 * #implies# list any hard and soft prerequisites for the feat, and #types#
 * lists the categories of the feat.
 */
Realms.featRules = function(rules, name, requires, implies, types) {
  if(name == 'Beast Shape' && Realms.baseRules == window.Pathfinder) {
    // PF allows Wild Shape to Huge at level 8 instead of 15
    for(var i = 0; i < requires.length; i++)
      requires[i] = requires[i].replace(/Druid\s*>=\s*15/, 'Druid >= 8');
  }
  Realms.baseRules.featRules(rules, name, requires, implies, types);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with feat #name# that are not
 * directly derived from the parmeters passed to featRules.
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
  } else if(name == 'Insidious Magic') {
    rules.defineRule
      ('magicNotes.insidiousMagic', 'casterLevel', '=', 'source + 11');
  } else if(name == 'Mind Over Body') {
    rules.defineRule('combatNotes.mindOverBody.1',
      'combatNotes.mindOverBody', '?', null,
      'intelligenceModifier', '=', null,
      'constitutionModifier', '+', '-source'
    );
    rules.defineRule('combatNotes.mindOverBody.2',
      'combatNotes.mindOverBody', '=', '0',
      'SumMetamagicFeats', '+', null
    );
    rules.defineRule('hitPoints',
      'combatNotes.mindOverBody.1', '+', null,
      'combatNotes.mindOverBody.2', '+', null
    );
  } else if(name == 'Pernicious Magic') {
    rules.defineRule('magicNotes.perniciousMagic',
      'casterLevel', '=', 'source + 11'
    );
  } else if((matchInfo = name.match(/^Spellcasting Prodigy .(.*).$/)) != null) {
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
  } else if(Realms.baseRules.featRulesExtra) {
    Realms.baseRules.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Realms.featureRules = function(rules, name, sections, notes) {
  if(typeof sections == 'string')
    sections = [sections];
  if(typeof notes == 'string')
    notes = [notes];
  if(Realms.baseRules == window.Pathfinder) {
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
  Realms.baseRules.featureRules(rules, name, sections, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
Realms.languageRules = function(rules, name) {
  Realms.baseRules.languageRules(rules, name);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with path #name#, which is a
 * selection for characters belonging to #group# and tracks path level via
 * #levelAttr#. The path grants the features and spells listed in #features#
 * and #spells#. #spellAbility#, if specified, names the ability for computing
 * spell difficulty class. #spellDict# is the dictionary of all spells used to
 * look up individual spell attributes.
 */
Realms.pathRules = function(
  rules, name, group, levelAttr, features, selectables, spellAbility,
  spellSlots, spells, spellDict
) {
  if(Realms.baseRules == window.Pathfinder)
    Realms.baseRules.pathRules(
      rules, name, group, levelAttr, features, selectables, [], [],
      spellAbility, spellSlots, spells, spellDict
    );
  else
    Realms.baseRules.pathRules(
      rules, name, group, levelAttr, features, selectables, spellAbility,
      spellSlots, spells, spellDict
    );
  // No changes needed to the rules defined by base method
  if(name.match(/Domain$/))
    QuilvynRules.featureListRules
      (rules, ["deityDomains =~ '" + name.replace(' Domain', '') + "' ? 1:" + name], 'Cleric', 'levels.Cleric', true);
}

/*
 * Defines in #rules# the rules associated with path #name# that are not
 * directly derived from the parmeters passed to pathRules.
 */
Realms.pathRulesExtra = function(rules, name) {
  if(name == 'Family Domain') {
    rules.defineRule('magicNotes.familialProtection',
      'charismaModifier', '=', 'source > 1 ? source : 1'
    );
    rules.defineRule('magicNotes.familialProtection.1', 'level', '=', null);
  } else if(name == 'Halfling Domain') {
    rules.defineRule('skillNotes.spurred', 'charismaModifier', '=', null);
  } else if(name == 'Mentalism Domain') {
    rules.defineRule('magicNotes.mentalControl', 'level', '=', 'source + 2');
  } else if(name == 'Nobility Domain') {
    rules.defineRule('magicNotes.inspireCompanions',
      'charismaModifier', '=', 'source >= 1 ? source : null'
    );
  } else if(name == 'Ocean Domain') {
    rules.defineRule('magicNotes.waterBreathing', 'level', '=', '10 * source');
  } else if(name == 'Orc Domain') {
    rules.defineRule('combatNotes.frenzy', 'levels.Cleric', '=', null);
    rules.defineRule
      ('combatNotes.frenzy.1', 'levels.Cleric', '=', 'source + 4');
  } else if(name == 'Renewal Domain') {
    rules.defineRule('combatNotes.rebound', 'charismaModifier', '=', null);
  } else if(name == 'Trade Domain') {
    rules.defineRule
      ('magicNotes.insiderKnowledge', 'charismaModifier', '=', null);
  } else if(Realms.baseRules.pathRulesExtra) {
    Realms.baseRules.pathRulesExtra(rules, name);
  }
};

/*
 * Defines in #rules# the rules associated with race #name#, which has the list
 * of hard prerequisites #requires#. #features# and #selectables# list
 * associated features and #languages# the automatic languages. #spells# lists
 * any natural spells, for which #spellAbility# is used to compute the save DC.
 * #spellDict# is the dictionary of all spells used to look up individual spell
 * attributes.
 */
Realms.raceRules = function(
  rules, name, requires, features, selectables, languages, spellAbility,
  spells, spellSlots, spellDict
) {
  Realms.baseRules.raceRules
    (rules, name, requires, features, selectables, languages, spellAbility,
     spells, spellSlots, spellDict);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with race #name# that are not
 * directly derived from the parmeters passed to raceRules.
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
  if(name == 'Air Genasi') {
    rules.defineRule('casterLevels.AG', 'airGenasiLevel', '=', '5');
  } else if(name == 'Deep Gnome') {
    rules.defineRule
      ('saveNotes.svirfneblinSpellResistance', 'deepGnomeLevel', '=', 'source + 11');
  } else if(name == 'Gray Dwarf') {
    rules.defineRule
      ('casterLevels.Duergar', 'grayDwarfLevel', '=', 'source * 2');
  } else if(name == 'Earth Genasi') {
    rules.defineRule('casterLevels.EG', 'earthGenasiLevel', '=', '5');
  } else if(name == 'Water Genasi') {
    rules.defineRule('casterLevels.WG', 'waterGenasiLevel', '=', '5');
  } else if(Realms.baseRules.raceRulesExtra) {
    Realms.baseRules.raceRulesExtra(rules, name);
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

/* Defines in #rules# the rules associated with magic school #name#. */
Realms.schoolRules = function(rules, name, features) {
  Realms.baseRules.schoolRules(rules, name, features);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with shield #name#, which adds #ac#
 * to the character's armor class, requires a #profLevel# proficiency level to
 * use effectively, imposes #skillPenalty# on specific skills
 * and yields a #spellFail# percent chance of arcane spell failure.
 */
Realms.shieldRules = function(
  rules, name, ac, profLevel, skillFail, spellFail
) {
  Realms.baseRules.shieldRules
    (rules, name, ac, profLevel, skillFail, spellFail);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with skill #name#, associated with
 * #ability# (one of 'strength', 'intelligence', etc.). #untrained#, if
 * specified is a boolean indicating whether or not the skill can be used
 * untrained; the default is true. #classes# lists the classes for which this
 * is a class skill; a value of "all" indicates that this is a class skill for
 * all classes. #synergies#, if specified, lists synergies to other skills and
 * abilities granted by high ranks in this skill.
 */
Realms.skillRules = function(
  rules, name, ability, untrained, classes, synergies
) {
  Realms.baseRules.skillRules
    (rules, name, ability, untrained, classes, synergies);
  // No changes needed to the rules defined by base method
};

/*
 * Defines in #rules# the rules associated with spell #name#, which is from
 * magic school #school#. #casterGroup# and #level# are used to compute any
 * saving throw value required by the spell. #description# is a verbose
 * description of the spell's effects.
 */
Realms.spellRules = function(
  rules, name, school, casterGroup, level, description
) {
  Realms.baseRules.spellRules
    (rules, name, school, casterGroup, level, description);
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
  Realms.baseRules.weaponRules(
    rules, name, profLevel, category, damage, threat, critMultiplier, range
  );
  // No changes needed to the rules defined by base method
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
    Realms.baseRules.randomizeOneAttribute.apply(this, [attributes, attribute]);
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

/* Returns HTML body content for user notes associated with this rule set. */
Realms.ruleNotes = function() {
  return '' +
    '<h2>Forgotton Realms Quilvyn Module Notes</h2>\n' +
    'Realms Quilvyn Module Version ' + REALMS_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Regional languages are not included in character languages lists.\n' +
    '  </li><li>\n' +
    '    The 1st-level Arcane Devotee "Enlarge Spell" feature is renamed\n' +
    '    "Freely Enlarge Spell" to distinguish it from the feat of the same\n' +
    '    name.\n' +
    '  </li><li>\n' +
    '    Harper Scout\'s "Harper Knowledge" feature is renamed "Bardic\n' +
    '    Knowledge", since the two are identical and stack.\n' +
    '  </li><li>\n' +
    '    Purple Dragon Knight\'s "Inspire Courage" feature is renamed\n' +
    '    "Knight\'s Courage", since it differs in details from the Bard\n' +
    '    feature.\n' +
    '  </li><li>\n' +
    '    Purple Dragon Knight\'s "Fear" feature is renamed "Knight\'s\n' +
    '    Fear", since it differs in details from the Hathran feature.\n' +
    '  </li>\n' +
    '</ul>\n' +
    '</p>';
};
