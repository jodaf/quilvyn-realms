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

var REALMS_VERSION = '2.2.1.23';

/*
 * This module loads the rules from the Forgotten Realms Campaign Setting (3.0)
 * source book. The Realms function contains methods that load rules for
 * particular parts of the rule book: raceRules for character races, magicRules
 * for spells, etc. These member methods can be called independently in order
 * to use a subset of the Realms rules. Similarly, the constant fields of Realms
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
  Realms.basePlugin = Realms.USE_PATHFINDER ? Pathfinder : SRD35;

  var rules = new QuilvynRules
    ('Forgotten Realms' + (Realms.USE_PATHFINDER?' - PF':''), REALMS_VERSION);
  Realms.rules = rules;

  Realms.CHOICES = Realms.basePlugin.CHOICES.concat(Realms.CHOICES_ADDED);
  rules.defineChoice('choices', Realms.CHOICES);
  rules.choiceEditorElements = Realms.choiceEditorElements;
  rules.choiceRules = Realms.choiceRules;
  rules.editorElements = SRD35.initialEditorElements();
  rules.getFormats = SRD35.getFormats;
  rules.getPlugins = Realms.getPlugins;
  rules.makeValid = SRD35.makeValid;
  rules.randomizeOneAttribute = Realms.randomizeOneAttribute;
  Realms.RANDOMIZABLE_ATTRIBUTES =
    Realms.basePlugin.RANDOMIZABLE_ATTRIBUTES.concat
    (Realms.RANDOMIZABLE_ATTRIBUTES_ADDED);
  rules.defineChoice('random', Realms.RANDOMIZABLE_ATTRIBUTES);
  rules.ruleNotes = Realms.ruleNotes;

  if(Realms.basePlugin == window.Pathfinder) {
    SRD35.ABBREVIATIONS['CMB'] = 'Combat Maneuver Bonus';
    SRD35.ABBREVIATIONS['CMD'] = 'Combat Maneuver Defense';
  }

  SRD35.createViewers(rules, SRD35.VIEWERS);
  rules.defineChoice('extras',
    'feats', 'featCount', 'sanityNotes', 'selectableFeatureCount',
    'validationNotes'
  );
  rules.defineChoice('preset', 'race', 'level', 'levels');

  Realms.ALIGNMENTS = Object.assign({}, Realms.basePlugin.ALIGNMENTS);
  Realms.ANIMAL_COMPANIONS =
    Object.assign( {}, Realms.basePlugin.ANIMAL_COMPANIONS);
  Realms.ARMORS = Object.assign({}, Realms.basePlugin.ARMORS);
  Realms.CLASSES = Object.assign({}, Realms.basePlugin.CLASSES);
  Realms.FAMILIARS = Object.assign({}, Realms.basePlugin.FAMILIARS);
  Realms.FEATS =
    Object.assign({}, Realms.basePlugin.FEATS, Realms.FEATS_ADDED);
  Realms.FEATURES =
    Object.assign({}, Realms.basePlugin.FEATURES, Realms.FEATURES_ADDED);
  Realms.GOODIES = Object.assign({}, Realms.basePlugin.GOODIES);
  Realms.LANGUAGES =
    Object.assign({}, Realms.basePlugin.LANGUAGES, Realms.LANGUAGES_ADDED);
  Realms.PATHS =
    Object.assign({}, Realms.basePlugin.PATHS, Realms.PATHS_ADDED);
  Realms.RACES['Gold Dwarf'] =
    Realms.basePlugin.RACES['Dwarf']
      .replace('Dwarf Ability', 'Gold Dwarf Ability')
      .replace('Dwarf Enmity', 'Gold Dwarf Enmity'),
  Realms.RACES['Gray Dwarf'] =
    Realms.basePlugin.RACES['Dwarf']
      .replace('Common', 'Undercommon')
      .replace('Dwarf Ability Adjustment', 'Gray Dwarf Ability Adjustment')
      .replace(/['"]?Darkvision['"]?/, '"Extended Darkvision"')
      .replace('Features=', 'Features=Aware,"Gray Dwarf Immunities","Light Sensitivity",Noiseless,"Race Level Adjustment",') + ' ' +
    'SpellAbility=intelligence ' +
    'SpellSlots=' +
      'Duergaren1:1=1,' +
      'Duergaren2:1=1';
  Realms.RACES['Shield Dwarf'] =
    Realms.basePlugin.RACES['Dwarf'],
  Realms.RACES['Drow Elf'] =
    Realms.basePlugin.RACES['Elf']
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
    Realms.basePlugin.RACES['Elf'],
  Realms.RACES['Sun Elf'] =
    Realms.basePlugin.RACES['Elf'].replace('Elf Ability', 'Sun Elf Ability'),
  Realms.RACES['Wild Elf'] =
    Realms.basePlugin.RACES['Elf'].replace('Elf Ability', 'Wild Elf Ability'),
  Realms.RACES['Wood Elf'] =
    Realms.basePlugin.RACES['Elf'].replace('Elf Ability', 'Wood Elf Ability'),
  Realms.RACES['Deep Gnome'] =
    Realms.basePlugin.RACES['Gnome']
      .replace('Common', 'Undercommon')
      .replace('Gnome Ability Adjustment', 'Deep Gnome Ability Adjustment')
      .replace('Dodge Giants', 'Exceptional Dodge')
      .replace('Low-Light Vision', 'Extended Darkvision')
      .replace('Features=', 'Features="Extra Luck","Know Depth","Race Level Adjustment",Shadowed,Sneaky,Stonecunning,"Svirfneblin Spell Resistance",Undetectable,') + ' ' +
    'SpellAbility=charisma ' +
    'SpellSlots=' +
      'Svirfneblinish1:1=1,' +
      'Svirfneblinish2:1=2,' +
      'Svirfneblinish3:1=1';
  Realms.RACES['Rock Gnome'] =
    Realms.basePlugin.RACES['Gnome'],
  Realms.RACES['Half-Elf'] =
    Realms.basePlugin.RACES['Half-Elf'],
  Realms.RACES['Half-Orc'] =
    Realms.basePlugin.RACES['Half-Orc'],
  Realms.RACES['Ghostwise Halfling'] =
    Realms.basePlugin.RACES['Halfling']
      .replace(/['"]?Fortunate['"]?/, '"Speak Without Sound"'),
  Realms.RACES['Lightfoot Halfling'] =
    Realms.basePlugin.RACES['Halfling'],
  Realms.RACES['Strongheart Halfling'] =
    Realms.basePlugin.RACES['Halfling']
      .replace(/['"]?Fortunate['"]?/, '"Strongheart Feat Bonus"'),
  Realms.RACES['Human'] =
    Realms.basePlugin.RACES['Human'],
  Realms.SCHOOLS = Object.assign({}, Realms.basePlugin.SCHOOLS);
  Realms.SHIELDS = Object.assign({}, Realms.basePlugin.SHIELDS);
  Realms.SKILLS = Object.assign({}, Realms.basePlugin.SKILLS);
  Realms.SPELLS =
    Object.assign({}, Realms.basePlugin.SPELLS, Realms.SPELLS_ADDED);
  for(var s in Realms.SPELLS_LEVELS) {
    Realms.SPELLS[s] =
      Realms.SPELLS[s].replace('Level=', 'Level=' + Realms.SPELLS_LEVELS[s] + ',');
  }
  Realms.WEAPONS =
    Object.assign({}, Realms.basePlugin.WEAPONS, Realms.WEAPONS_ADDED);

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
    Realms.RACES, Realms.REGIONS
  );

  if(window.SRD35NPC != null) {
    SRD35NPC.identityRules(rules, SRD35NPC.CLASSES);
    SRD35NPC.magicRules(rules, SRD35NPC.SPELLS);
    SRD35NPC.talentRules(rules, SRD35NPC.FEATURES);
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
  'Poison Tolerance':
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
    'Section=magic,save Note="+2 DC Sorcerer fire spells","+4 vs. fire spells"',
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
    'Note="All Knowledge is a class skill/+1 any 2 Knowledge skills"',
  // 3.0 Animal Empathy, Intuit Direction => 3.5 Handle Animal, Survival
  'Ethran':
    'Section=ability,skill ' +
    'Note="+2 charisma w/Rashemi",' +
         '"+2 Handle Animal/+2 Survival"',
  'Foe Hunter':
    'Section=combat Note="+1 damage, double critical range w/regional foe"',
  'Forester':'Section=skill Note="+2 Heal/+2 Survival"',
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
    'Note="DC 9+foe level check to detect Weave magic, Foe DC %V check to detect Shadow Weave spell"',
  'Luck Of Heroes':'Section=save Note="+1 Fortitude/+1 Reflex/+1 Will"',
  'Magical Artisan':
    'Section=magic Note="Reduce item creation base price by 25%"',
  'Magical Training':
    'Section=magic ' +
    'Note="<i>Dancing Lights</i>, <i>Daze</i>, <i>Mage Hand</i> 1/dy"',
  'Mercantile Background':
    'Section=skill Note="+2 Appraise/chosen Craft/chosen Profession"',
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
  'Poison Tolerance':'Section=save Note="+4 vs. poison"',
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
  'Advanced Illusionist':'Section=magic Note="+1 caster level illusion spells"',
  'Beguiling':'Section=skill Note="+2 Bluff"',
  'Compelling Magic':'Section=magic Note="+2 DC compulsion spells"',
  'Creator':
    'Section=magic,feature ' +
    'Note="+1 caster level creation spells",' +
         '"+1 General Feat (Skill Focus(chosen Craft))"',
  'Detect Portal':
    'Section=skill Note="DC 20 Search to detect in/active portals"',
  'Disabling Touch':
    'Section=combat Note="Touch attack causes -2 Str and Dex for 1 min 1/dy"',
  'Familial Protection':
    'Section=magic Note="R10\' %V targets +4 AC for %1 rd 1/dy"',
  'Frenzy':'Section=combat Note="+%V (+%1 vs. dwarf/elf) smite damage 1/dy"',
  'Hammer Specialist':
    'Section=feature ' +
    'Note="+2 General Feat (Weapon Proficiency and Focus w/chosen hammer)"',
  'Hated Foe':
    'Section=combat,save ' +
    'Note="+2 attack, AC vs. one foe for 1 min 1/dy",' +
         '"+2 saves vs. one foe for 1 min 1/dy"',
  'Insider Knowledge':
    'Section=magic ' +
    'Note="<i>Detect Thoughts</i> on 1 target for %V min 1/dy (Will neg)"',
  'Inspire Companions':
    'Section=magic ' +
    'Note="+2 allies\' attack, damage, skill, ability rolls for %V rd 1/dy"',
  'Mental Control':
    'Section=magic ' +
    'Note="Touch to allow target +%V on next Will save for 1 hr 1/dy"',
  'Rebound':'Section=combat Note="Recover 1d8+%V HP points when negative 1/dy"',
  'Skilled Caster':'Section=skill Note="+2 Concentration/+2 Spellcraft"',
  'Spurred':
    'Section=skill Note="+%V Climb, Hide, Jump, Move Silently for 10 min 1/dy"',
  'Stone Affinity':
    'Section=skill Note="+2 Search (stone, metal), automatic check w/in 10\'"',
  'Stormfriend':'Section=save Note="Electricity resistance 5"',
  'Strike Of Vengeance':
    'Section=combat Note="Strike for max damage after foe hit 1/dy"',
  'Turn It On':'Section=ability Note="+4 charisma for 1 min 1/dy"',
  'Turn Lycanthropes':'Section=combat Note="Turn lycanthropes as undead"',
  'Turn Oozes':'Section=combat Note="Turn oozes as undead"',
  'Turn Reptiles':'Section=combat Note="Turn reptiles as undead"',
  'Turn Spiders':'Section=combat Note="Turn spiders as undead"',
  'Water Breathing':'Section=magic Note="Breathe water %V rd/dy"',

  // Race
  'Aasimar Ability Adjustment':'Section=ability Note="+2 Wisdom/+2 Charisma"',
  'Aasimar Alertness':'Section=skill Note="+2 Listen/+2 Spot"',
  'Aasimar Resistance':'Section=save Note="5 vs. acid, cold, and electricity"',
  'Amphibious':'Section=feature Note="Breathe water at will"',
  'Aware':'Section=skill Note="+1 Listen/+1Spot"',
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
  'Drow Elf Spell Resistance':'Section=save Note="DC %V"',
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
  'Noiseless':'Section=skill Note="+4 Move Silently"',
  'Race Level Adjustment':'Section=ability Note="-%V Level"',
  'Sly':'Section=skill Note="+2 Hide"',
  'Shadowed':'Section=skill Note="+2 Hide in darkened underground areas"',
  'Sneaky':'Section=skill Note="+2 Hide"',
  'Speak Without Sound':'Section=feature Note="R20\' Telepathic communication"',
  'Strong Will':'Section=save Note="+2 Will vs. spells"',
  'Strongheart Feat Bonus':'Section=feature Note="+1 General Feat"',
  'Sun Elf Ability Adjustment':
    'Section=ability Note="+2 Intelligence/-2 Constitution"',
  'Svirfneblin Spell Resistance':'Section=save Note="DC %V"',
  'Tiefling Ability Adjustment':
    'Section=ability Note="+2 Dexterity/+2 Intelligence/-2 Charisma"',
  'Tiefling Resistance':'Section=save Note="5 vs. cold, electricity, and fire"',
  'Undetectable':'Section=magic Note="Continuous <i>Nondetection</i>"',
  'Water Genasi Ability Adjustment':
    'Section=ability Note="+2 Constitution/-2 Charisma"',
  'Wild Elf Ability Adjustment':
    'Section=ability Note="+2 Dexterity/-2 Intelligence"',
  'Wood Elf Ability Adjustment':
    'Section=ability ' +
    'Note="+2 Strength/+2 Dexterity/-2 Constitution/-2 Intelligence/-2 Charisma"'

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
      '"1:Stone Affinity"',
  'Charm Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Turn It On"',
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
      '"1:Spurred"',
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
      '"1:Mental Control"',
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
      '"1:Inspire Companions"',
  'Ocean Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Water Breathing"',
  'Orc Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Frenzy"',
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
      '"1:Rebound"',
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
      '"1:Disabling Touch"',
  'Time Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Improved Initiative"',
  'Trade Domain':
    'Group=Cleric ' +
    'Level=levels.Cleric ' +
    'Features=' +
      '"1:Insider Knowledge"',
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
      .replace('Features=', 'Features=Aware,"Gray Dwarf Immunities","Light Sensitivity",Noiseless,"Race Level Adjustment",') + ' ' +
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
      .replace('Features=', 'Features="Extra Luck","Know Depth","Race Level Adjustment",Shadowed,Sneaky,Stonecunning,"Svirfneblin Spell Resistance",Undetectable,') + ' ' +
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
      .replace('Fortunate', '"Strongheart Feat Bonus"'),
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
      '1:Beguiling,1:Darkvision,"1:Native Outsider",' +
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
    'Description="5\'w by $RS\'l flame ${Math.min(5,Math.floor(lvl/2))}d8 HP (Ref half)"',
  'Analyze Portal':
    'School=Divination ' +
    'Level=B3,Portal2,W3 ' +
    'Description="R60\' cone info on portals for $L rd or conc"',
  'Anyspell':
    'School=Transmutation ' +
    'Level=Spell3 ' +
    'Description="Self prepare up to 2nd level arcane spell from written source"',
  'Armor Of Darkness':
    'School=Abjuration ' +
    'Level=Darkness4 ' +
    'Description="Touched +${Math.min(8,Math.floor(lvl/4)+3)} AC, darkvision for $L10 min"',
  'Blacklight':
    'School=Evocation ' +
    'Level=Darkness3,W3 ' +
    'Description="R$RS\' Target center 20\' radius darkness only caster can see within for $L rd (Will neg)"',
  'Claws Of Darkness':
    'School=Illusion ' +
   'Level=W2 ' +
    'Description="Self hands become 6\' extendable claws 1d4 HP cold and slow when grappling (Fort neg) for $L rd"',
  'Cloak Of Dark Power':
    'School=Abjuration ' +
    'Level=Drow1 ' +
    'Description="Touched protected from sunlight, +4 save vs. light and dark for $L min"',
  'Create Magic Tattoo':
    'School=Conjuration ' +
    'Level=W2 ' +
    'Description="Touched gains tattoo w/variable effects for 1 dy"',
  'Darkbolt':
    'School=Evocation ' +
    'Level=Darkness5 ' +
    'Description="R$RM\' ${Math.min(Math.floor(lvl/2),7)} ranged touch bolts 2d8 HP, dazed (Will neg)"',
  "Elminster's Evasion":
    'School=Evocation ' +
    'Level=W9 ' +
    'Description="Self and up to 50 lb teleport to named locale"',
  'Fantastic Machine':
    'School=Illusion ' +
    'Level=Craft6,Gnome6 ' +
    'Description="Lg machine (HP 22, AC 14, slam +5 1d8+4, rock +3 2d6+4, load 230) obeys commands for $L min"',
  'Fire Stride':
    'School=Transmutation ' +
    'Level=W4 ' +
    'Description="Self teleport $RL\' between fires $L times for $L10 min"',
  'Flashburst':
    'School=Evocation ' +
    'Level=W3 ' +
    'Description="R$RL\' Targets in 20\' radius dazzled, all w/in 120\' blinded (Will neg) for 2d8 rd"',
  'Flensing':
    'School=Evocation ' +
    'Level=W8 ' +
    'Description="R$RS\' Target 2d6 HP (Fort half), lose 1d6 Cha and Con (Fort neg) for 4 rd"',
  'Gate Seal':
    'School=Abjuration ' +
    'Level=B6,C6,D6,W6 ' +
    'Description="R$RS\' seal target gate or portal"',
  'Gembomb':
    'School=Conjuration ' +
    'Level=Gnome2,Trade2 ' +
    'Description="Up to 5 gems become R100\' ranged touch bombs totaling ${Math.min(5,Math.floor(lvl/2))}d8 HP (Ref half)"',
  'Great Shout':
    'School=Evocation ' +
    'Level=B6,W8 ' +
    'Description="R$RS\' Objects in range 20d6 HP (Ref neg), creatures in cone 10d6 HP, stunned 1 rd, deaf 4d6 rd (Fort half)"',
  'Greater Anyspell':
    'School=Transmutation ' +
    'Level=Spell6 ' +
    'Description="Self prepare up to 5th level arcane spell from written source"',
  'Greater Fantastic Machine':
    'School=Illusion ' +
    'Level=Craft9 ' +
    'Description="Lg machine (HP 88, AC 20, slam +17,+12 1d8+9, rock +12,+7 2d6+9, load 520) obeys commands for $L min"',
  "Grimwald's Graymantle":
    'School=Necromancy ' +
    'Level=W5 ' +
    'Description="R$RM\' Target prevented from heal, restore, regen for $L rd (Fort neg)"',
  'Lesser Ironguard':
    'School=Abjuration ' +
    'Level=W5 ' +
    'Description="Touched unaffected by normal metal for $L rd"',
  'Maelstrom':
    'School=Conjuration ' +
    'Level=Ocean8 ' +
    'Description="R$RL\' Targets in whirlpool 3d8 HP for 2d4 rd (Ref et al neg) for $L rd"',
  'Maw Of Stone':
    'School=Transmutation ' +
    'Level=Cavern7 ' +
    'Description="Animated opening can attack and grapple"',
  'Moon Blade':
    'School=Evocation ' +
    'Level=Moon3 ' +
    'Description="Moonlight blade touch attack 1d8+$Ldiv2 HP (undead 2d8+$L HP) for $L min"',
  'Moon Path':
    'School=Evocation ' +
    'Level=Moon5 ' +
    'Description="Glowing pathway 5\'-20\'w by $L15\'l for $L min; <i>Sanctuary</i> on path for $L designed"',
  'Moonbeam':
    'School=Evocation ' +
    'Level=Moon2 ' +
    'Description="R$RS\' Target lycanthropes become animal for $L min (Will neg)"',
  'Moonfire':
    'School=Evocation ' +
    'Level=Moon9 ' +
    'Description="R$RS\' Cone ${Math.min(Math.floor(lvl/2),10)}d8 HP (undead x2) (Ref half), changed creatures revert (Will neg), marks auras for $L min"',
  'Scatterspray':
    'School=Transmutation ' +
    'Level=W1 ' +
    'Description="R$RS\' Little items w/in 1\' radius scatter; creatures w/in 10\' 1d8 HP (Ref neg)"',
  'Shadow Mask':
    'School=Illusion ' +
    'Level=W2 ' +
    'Description="Self face hidden, +4 save vs. light and dark, 50% gaze attack for $L10 min"',
  'Shadow Spray':
    'School=Illusion ' +
    'Level=W2 ' +
    'Description="R$RM\' Creatures in 5\' radius lose 2 Str, dazed 1 rd, -2 fear saves for $L rd (Fort neg)"',
  "Snilloc's Snowball Swarm":
    'School=Evocation ' +
    'Level=W2 ' +
    'Description="R$RM\' Creatures in 10\' radius ${Math.min(2+Math.floor((lvl-3)/2),5)}d6 HP cold (Ref half)"',
  'Spider Curse':
    'School=Transmutation ' +
    'Level=Spider6 ' +
    'Description="R$RM\' Target polymorph to dominated drider for $L dy (Will neg)"',
  'Spider Shapes':
    'School=Transmutation ' +
    'Level=Spider9 ' +
    'Description="R$RS\' Willing target polymorph to monstrous spider for $L hr"',
  'Spiderform':
    'School=Transmutation ' +
    'Level=Drow5 ' +
    'Description="Self polymorph to drider or monstrous spider for $L hr"',
  'Stone Spiders':
    'School=Transmutation ' +
    'Level=Spider7 ' +
    'Description="R$RS\' Transform 1d3 pebbles into controlled monstrous spiders for $L rd"',
  'Thunderlance':
    'School=Evocation ' +
    'Level=W4 ' +
    'Description="Self wield shimmering staff (+${Math.floor(1+lvl/2)} 2d6+${Math.floor(1+lvl/2)} x3@20) 1\'-20\' long for $L rd"',
  'Waterspout':
    'School=Conjuration ' +
    'Level=Ocean7 ' +
    'Description="R$RL\' 10\'w by 80\'h spout moves 30\'/rd, touched creatures 2d6 HP (Ref neg) for $L rd"'
};
Realms.SPELLS = Object.assign({}, SRD35.SPELLS, Realms.SPELLS_ADDED);
Realms.SPELLS_LEVELS = {
  'Acid Arrow':'Slime2',
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
  'Bear\'s Endurance':'Dwarf2,Retribution2,Suffering2',
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
  'Cat\'s Grace':'Elf2,Halfling2',
  'Cause Fear':'Orc1',
  'Charm Monster':'Charm5',
  'Charm Person':'Charm1,Renewal1',
  'Clairaudience/Clairvoyance':'Drow2,Mentalism3,Planning3',
  'Cloak Of Chaos':'Orc8',
  'Command':'Tyranny1',
  'Commune With Nature':'Elf5',
  'Contingency':'Time6',
  'Control Undead':'Undeath7',
  'Control Weather':'Storm7',
  'Create Greater Undead':'Undeath8',
  'Create Undead':'Undeath6',
  'Create Water':'Wateren0',
  'Creeping Doom':'Scalykind7,Spider8',
  'Dancing Lights':'Drowen0',
  'Darkness':'Cavern2,Drowen2,Tieflen2',
  'Death Ward':'Undeath4',
  'Deathwatch':'Planning1',
  'Demand':'Charm8,Nobility8',
  'Desecrate':'Undeath2',
  'Destruction':'Slime7',
  'Detect Scrying':'Planning5',
  'Detect Secret Doors':'Cavern1',
  'Detect Thoughts':'Mentalism2,Trade1',
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
  'Eagle\'s Splendor':'Trade3',
  'Earthquake':'Cavern8',
  'Elemental Swarm':'Dwarf9,Ocean9',
  'Endure Elements':'Ocean1',
  'Energy Drain':'Undeath9',
  'Enervation':'Suffering4',
  'Enlarge Person':'Duergaren1',
  'Enthrall':'Nobility2,Tyranny2',
  'Entropic Shield':'Storm1',
  'Erase':'Rune1',
  'Etherealness':'Portal7',
  'Explosive Runes':'Rune4',
  'Eyebite':'Orc6,Scalykind6,Suffering7',
  'Fabricate':'Dwarf5,Trade5',
  'Faerie Fire':'Drowen1,Moon1',
  'Fear':'Tyranny4',
  'Feeblemind':'Suffering5',
  'Find The Path':'Cavern6,Elf6',
  'Fire Shield':'Retribution4',
  'Forbiddance':'Hatred6',
  'Forcecage':'Craft8',
  'Foresight':'Fate9,Halfling9,Time8',
  'Freedom':'Renewal9',
  'Freedom Of Movement':'Halfling4,Ocean4,Time4',
  'Freezing Sphere':'Ocean6',
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
  'Heroes\' Feast':'Family6,Planning6,Renewal6',
  'Horrid Wilting':'Suffering9',
  'Ice Storm':'Storm5',
  'Imbue With Spell Ability':'Family4',
  'Implosion':'Slime9',
  'Imprisonment':'Cavern9',
  'Insanity':'Charm7,Moon7',
  'Insect Plague':'Spider5',
  'Instant Summons':'Rune7',
  'Invisibility':'Duergaren2',
  'Iron Body':'Metal8',
  'Irresistible Dance':'Gnome8',
  'Keen Edge':'Metal3',
  // 3.0 Random Action => 3.5 Lesser Confusion
  'Lesser Confusion':'Mentalism1',
  'Lesser Planar Binding':'Rune5',
  'Lesser Restoration':'Renewal2',
  'Levitate':'Airen2',
  'Light':'Aasimaren0',
  'Limited Wish':'Spell7',
  'Liveoak':'Elf7',
  'Mage Armor':'Spell1',
  'Mage\'s Disjunction':'Spell9',
  'Mage\'s Faithful Hound':'Halfling5',
  'Mage\'s Magnificent Mansion':'Trade7',
  'Magic Fang':'Scalykind1',
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
  'Message':'Trade1',
  'Mind Blank':'Fate8,Mentalism8,Trade8',
  'Mind Fog':'Mentalism5',
  'Minor Creation':'Craft4,Gnome4',
  'Minor Image':'Gnome3,Illusion2',
  'Mislead':'Illusion6',
  'Mnemonic Enhancer':'Spell4',
  'Modify Memory':'Mentalism4',
  // 3.0 Mass Haste => 3.5 Moment Of Prescience
  'Moment Of Prescience':'Time7',
  'Move Earth':'Halfling6',
  'Nightmare':'Darkness7',
  'Nondetection':'Svirfneblinish3',
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
  'Sending':'Trade4',
  'Shadow Walk':'Halfling7',
  'Shapechange':'Scalykind9',
  'Shield Of Faith':'Retribution1',
  'Shield Other':'Family2',
  'Silence':'Spell2',
  'Silent Image':'Gnome1,Illusion1',
  'Sleet Storm':'Storm4',
  'Snare':'Elf3',
  // 3.0 Emotion => 3.5 Song Of Discord
  'Song Of Discord':'Hatred4',
  'Sound Burst':'Ocean2',
  'Speak With Dead':'Retribution3',
  'Spell Turning':'Retribution7',
  'Spider Climb':'Spider1',
  'Status':'Fate4,Planning4',
  'Stone Shape':'Craft3',
  'Stone Tell':'Dwarf6',
  'Storm Of Vengeance':'Nobility9,Retribution9,Storm9',
  'Suggestion':'Charm3,Drow3',
  'Summon Monster I':'Portal1',
  'Summon Monster VI':'Storm6',
  'Summon Nature\'s Ally IX':'Gnome9',
  'Summon Swarm':'Spider2',
  'Sunburst':'Elf8',
  'Symbol Of Death':'Rune8',
  'Symbol Of Pain':'Suffering8',
  'Telepathic Bond':'Family5,Mentalism6',
  'Teleport':'Portal5',
  'Teleportation Circle':'Rune9',
  'Time Stop':'Planning9,Time9',
  'Transmute Metal To Wood':'Metal7',
  'Transmute Rock To Mud':'Slime6',
  'Tree Stride':'Elf4',
  'True Seeing':'Trade6',
  'True Strike':'Elf1,Fate1,Time1',
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
  Realms.SPELLS[s] =
    Realms.SPELLS[s].replace('Level=', 'Level=' + Realms.SPELLS_LEVELS[s] + ',');
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
  Realms.basePlugin.abilityRules(rules);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to animal companions and familiars. */
Realms.aideRules = function(rules, companions, familiars) {
  Realms.basePlugin.aideRules(rules, companions, familiars);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to combat. */
Realms.combatRules = function(rules, armors, shields, weapons) {
  Realms.basePlugin.combatRules(rules, armors, shields, weapons);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to basic character identity. */
Realms.identityRules = function(
  rules, alignments, classes, deities, paths, races, regions
) {

  QuilvynUtils.checkAttrTable(regions, []);

  if(Realms.basePlugin == window.Pathfinder)
    Pathfinder.identityRules(
      rules, alignments, classes, deities, {}, paths, races, Pathfinder.TRACKS,
      Pathfinder.TRAITS
    );
  else
    SRD35.identityRules(rules, alignments, classes, deities, paths, races)

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
  if(Realms.basePlugin == window.Pathfinder) {
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
    ('region', 'Region', 'select-one', 'regions', 'experience');
  rules.defineSheetElement('Region', 'Alignment');

};

/* Defines rules related to magic use. */
Realms.magicRules = function(rules, schools, spells) {
  Realms.basePlugin.magicRules(rules, schools, spells);
  // No changes needed to the rules defined by base method
};

/* Defines rules related to character aptitudes. */
Realms.talentRules = function(
  rules, feats, features, goodies, languages, skills
) {
  Realms.basePlugin.talentRules
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
      QuilvynUtils.getAttrValueArray(attrs, 'SpellSlots')
    );
    if(Realms.basePlugin.classRulesExtra)
      Realms.basePlugin.classRulesExtra(rules, name);
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
    if(Realms.basePlugin.schoolRulesExtra)
      Realms.basePlugin.schoolRulesExtra(rules, name);
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
    if(Realms.basePlugin.skillRulesExtra)
      Realms.basePlugin.skillRulesExtra(rules, name);
  } else if(type == 'Spell') {
    var description = QuilvynUtils.getAttrValue(attrs, 'Description');
    var groupLevels = QuilvynUtils.getAttrValueArray(attrs, 'Level');
    var school = QuilvynUtils.getAttrValue(attrs, 'School');
    var schoolAbbr = school.substring(0, 4);
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
  Realms.basePlugin.alignmentRules(rules, name);
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
  Realms.basePlugin.armorRules
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
  if(Realms.basePlugin == window.Pathfinder) {
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
  Realms.basePlugin.classRules(
    rules, name, requires, hitDie, attack, skillPoints, saveFort, saveRef,
    saveWill, skills, features, selectables, languages, casterLevelArcane,
    casterLevelDivine, spellAbility, spellSlots
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
  rules, name, str, dex, con, intel, wis, cha, hd, ac, attack, damage, size,
  level
) {
  Realms.basePlugin.companionRules(
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
  Realms.basePlugin.deityRules(rules, name, alignment, domains, weapons);
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
  Realms.basePlugin.familiarRules(
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
  Realms.basePlugin.featRules(rules, name, requires, implies, types);
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
  } else if((matchInfo = name.match(/^Spellcasting\sProdigy\s(.*).$/)) != null) {
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
  } else if(Realms.basePlugin.featRulesExtra) {
    Realms.basePlugin.featRulesExtra(rules, name);
  }

};

/*
 * Defines in #rules# the rules associated with feature #name#. #sections# lists
 * the sections of the notes related to the feature and #notes# the note texts;
 * the two must have the same number of elements.
 */
Realms.featureRules = function(rules, name, sections, notes) {
  if(Realms.basePlugin == window.Pathfinder) {
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
  Realms.basePlugin.featureRules(rules, name, sections, notes);
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
  Realms.basePlugin.goodyRules
    (rules, name, pattern, effect, value, attributes, sections, notes);
  // No changes needed to the rules defined by base method
};

/* Defines in #rules# the rules associated with language #name#. */
Realms.languageRules = function(rules, name) {
  Realms.basePlugin.languageRules(rules, name);
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
  if(Realms.basePlugin == window.Pathfinder)
    Realms.basePlugin.pathRules(
      rules, name, group, levelAttr, features, selectables, [], [],
      spellAbility, spellSlots
    );
  else
    Realms.basePlugin.pathRules(
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
  } else if(name == 'Renewal Domain') {
    rules.defineRule('combatNotes.rebound', 'charismaModifier', '=', null);
  } else if(name == 'Trade Domain') {
    rules.defineRule
      ('magicNotes.insiderKnowledge', 'charismaModifier', '=', null);
  } else if(Realms.basePlugin.pathRulesExtra) {
    Realms.basePlugin.pathRulesExtra(rules, name);
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
  Realms.basePlugin.raceRules
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
  if(name == 'Air Genasi') {
    rules.defineRule('casterLevels.Air Genasi', 'airGenasiLevel', '=', '5');
  } else if(name == 'Deep Gnome') {
    // Several web pages say that the DC for Deep Gnome spells is Charisma
    // based with a +4 racial modifier. The FG Campaign Setting says 10 +
    // spell level, so we go with that; otherwise, the value would be
    // 14 + source instead of 10
    rules.defineRule
      ('spellDifficultyClass.Svirfneblinish', 'charismaModifier', '=', '10');
    rules.defineRule
      ('saveNotes.svirfneblinSpellResistance', 'deepGnomeLevel', '=', 'source + 11');
  } else if(name == 'Drow Elf') {
    rules.defineRule
      ('saveNotes.drowElfSpellResistance', 'drowElfLevel', '=', 'source + 11');
    rules.defineRule('saveNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule('skillNotes.lightSensitivity', 'drowElfLevel', '=', '1');
    rules.defineRule('combatNotes.lightSensitivity', 'drowElfLevel', '=', '1');
  } else if(name == 'Gray Dwarf') {
    rules.defineRule
      ('casterLevels.Duergar', 'grayDwarfLevel', '=', 'source * 2');
    rules.defineRule('saveNotes.lightSensitivity', 'grayDwarfLevel', '=', '2');
    rules.defineRule('skillNotes.lightSensitivity', 'grayDwarfLevel', '=', '2');
    rules.defineRule('combatNotes.lightSensitivity', 'grayDwarfLevel', '=','2');
  } else if(name == 'Earth Genasi') {
    rules.defineRule('casterLevels.Earth Genasi', 'earthGenasiLevel', '=', '5');
  } else if(name == 'Water Genasi') {
    rules.defineRule('casterLevels.Water Genasi', 'waterGenasiLevel', '=', '5');
  } else if(Realms.basePlugin.raceRulesExtra) {
    Realms.basePlugin.raceRulesExtra(rules, name);
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
  Realms.basePlugin.schoolRules(rules, name, features);
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
  Realms.basePlugin.shieldRules
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
  Realms.basePlugin.skillRules
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
  Realms.basePlugin.spellRules
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
  Realms.basePlugin.weaponRules(
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
  return Realms.basePlugin.choiceEditorElements(rules, type);
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
    Realms.basePlugin.randomizeOneAttribute.apply(this, [attributes, attribute]);
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
  return [Realms.basePlugin].concat(Realms.basePlugin.rules.getPlugins());
};

/* Returns HTML body content for user notes associated with this rule set. */
Realms.ruleNotes = function() {
  return '' +
    '<h2>Forgotten Realms Quilvyn Module Notes</h2>\n' +
    'Realms Quilvyn Module Version ' + REALMS_VERSION + '\n' +
    '\n' +
    '<h3>Usage Notes</h3>\n' +
    '<p>\n' +
    '<ul>\n' +
    '  <li>\n' +
    '    Quilvyn gives Drow Elves proficiency in both short sword and\n' +
    '    rapier, rather than a choice of the two.\n' +
    '  </li><li>\n' +
    '    The Cavern Domain granted power "Stonecunning" is renamed "Stone\n' +
    '    Affinity", since it stacks with the Dwarf "Stonecunning" feature.\n' +
    '  </li><li>\n' +
    '    Regional languages are not included in character languages lists.\n' +
    '  </li><li>\n' +
    '    The "Resist Poison" feat is renamed "Poison Tolerance" to\n' +
    '    distinguish it from the racial feature of the same name.\n' +
    '  </li><li>\n' +
    '    The 1st-level Arcane Devotee "Enlarge Spell" feature is renamed\n' +
    '    "Freely Enlarge Spell" to distinguish it from the feat of the same\n' +
    '    name.\n' +
    '  </li><li>\n' +
    '    The Divine Champion "Lay On Hands" feature is renamed "Faith\n' +
    '    Healing" since it differs in detail from the Paladin feature.\n' +
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
