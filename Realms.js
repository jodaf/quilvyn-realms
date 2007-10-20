/*
Copyright 2005, James J. Hayes

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

/*
 * This module loads the rules from the Forgotten Realms campaign setting.  The
 * Realms function contains methods that load rules for particular
 * parts/chapters of the rule book; raceRules for character races, magicRules
 * for spells, etc.  These member methods can be called independently in order
 * to use a subset of the rules.  Similarly, the constant fields of Realms
 * (DOMAINS, FEATS, etc.) can be thinned to limit the user's choices.
 */
function Realms() {

  if(window.PH35 == null) {
    alert('The Realms module requires use of the PH35 module');
    return;
  }

  // Define a new rule set w/the same editor and standard viewer as PH35
  var rules = new ScribeRules('Forgotten Realms');
  rules.editorElements = PH35.initialEditorElements();
  PH35.createViewers(rules, PH35.VIEWERS);
  // Pick up the PH35 rules, w/minor mods for deities and weapons
  PH35.abilityRules(rules);
  PH35.raceRules(rules, PH35.LANGUAGES, Realms.RACES);
  PH35.classRules(rules, PH35.CLASSES);
  PH35.companionRules(rules, PH35.COMPANIONS);
  PH35.skillRules(rules, PH35.SKILLS, PH35.SUBSKILLS);
  PH35.featRules(rules, PH35.FEATS, PH35.SUBFEATS);
  PH35.descriptionRules(rules, PH35.ALIGNMENTS, Realms.DEITIES, PH35.GENDERS);
  PH35.equipmentRules
    (rules, PH35.ARMORS, PH35.GOODIES, PH35.SHIELDS, PH35.WEAPONS);
  PH35.combatRules(rules);
  PH35.adventuringRules(rules);
  PH35.magicRules(rules, PH35.CLASSES, PH35.DOMAINS, PH35.SCHOOLS);
  // Pick up the DMG rules, if available
  if(window.DMG35 != null) {
    DMG35.npcClassRules(rules, DMG35.NPC_CLASSES);
    DMG35.prestigeClassRules(rules, DMG35.PRESTIGE_CLASSES);
    DMG35.companionRules(rules, DMG35.COMPANIONS);
  }
  // So far, same character creation procedures as PH35
  rules.defineChoice('preset', 'race', 'experience', 'levels');
  rules.defineChoice('random', PH35.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = PH35.randomizeOneAttribute;
  rules.makeValid = PH35.makeValid;
  // Add Forgotten Realms-specific rules
  //Realms.featRules(rules, Realms.FEATS, Realms.SUBFEATS);
  //Realms.magicRules
  //  (rules, PH35.CLASSES.concat(Realms.CLASSES), Realms.DOMAINS);
  //Realms.prestigeClassRules(rules, Realms.PRESTIGE_CLASSES);
  Realms.raceRules(rules, Realms.RACES);
  // Let Scribe know we're here
  Scribe.addRuleSet(rules);
  Realms.rules = rules;

}

// Arrays of choices
Realms.DEITIES = [
  'Akadi (N):Air/Illusion/Travel/Trickery',
  'Auril (NE):Air/Evil/Storm/Water',
  'Axuth (LN):Illusion/Magic/Knowledge/Law/Spell',
  'Bane (LE):Destruction/Evil/Hatred/Law/Tyranny',
  'Beshaba (CE):Chaos/Evil/Fate/Luck/Trickery',
  'Chauntea (NG):Animal/Earth/Good/Plant/Protection/Renewal',
  'Cyric (CE):Chaos/Destruction/Evil/Illusion/Trickery',
  'Deneir (NG):Good/Knowledge/Protection/Rune',
  'Eldath (NG):Family/Good/Plant/Protection/Water',
  'Finder Wyvernspur (CN):Chaos/Charm/Renewal/Scalykind'
];
Realms.RACES = [
  'Gold Dwarf', 'Gray Dwarf', 'Shield Dwarf', 'Drow Elf', 'Moon Elf',
  'Sun Elf', 'Wild Elf', 'Wood Elf', 'Deep Gnome', 'Rock Gnome',
  'Ghostwise Halfling', 'Lightfoot Halfling', 'Strongheart Halfling',
  'Aasimar', 'Air Genasi', 'Earth Genasi', 'Fire Genasi', 'Water Genasi',
  'Tiefling'
];

Realms.raceRules = function(rules, races) {

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, notes;
    var race = races[i];

    if(race == 'Gold Dwarf') {
      continue; //TODO

    } else if(race == 'Gray Dwarf') {
      continue; //TODO

    } else if(race == 'Shield Dwarf') {
      adjustment = null;
      features = null;
      notes = null;

    } else if(race == 'Drow Elf') {
      continue; //TODO

    } else if(race == 'Moon Elf') {
      adjustment = null;
      features = null;
      notes = null;

    } else if(race == 'Sun Elf') {
      adjustment = '+2 intelligence/-2 constitution';
      features = null;
      notes = null;

    } else if(race == 'Wild Elf') {
      adjustment = '+2 dexterity/-2 intelligence';
      features = null;
      notes = null;

    } else if(race == 'Wood Elf') {
      adjustment =
        '+2 strength/+2 dexterity/-2 constitution/-2 intelligence/-2 charisma';
      features = null;
      notes = null;

    } else if(race == 'Deep Gnome') {
      adjustment = '-2 strength/+2 dexterity/+2 wisdom/-4 charisma';
      features = null;
      notes = null;
      continue; //TODO

    } else if(race == 'Rock Gnome') {
      adjustment = null;
      features = null;
      notes = null;

    } else if(race == 'Ghostwise Halfling') {
      adjustment = null;
      features = ['Speak Without Sound'];
      notes = [
        'featureNotes.speakWithoutSoundFeature:' +
          'Telepathic communication w/in 20 ft'
      ];
      rules.deleteRule('ghostwiseHalflingFeatures.Fortunate', 'level');
      rules.deleteRule('ghostwiseHalflingFeatures.Fortunate', 'race');

    } else if(race == 'Lightfoot Halfling') {
      adjustment = null;
      features = null;
      notes = null;

    } else if(race == 'Strongheart Halfling') {
      adjustment = null;
      features = null;
      notes = null;
      rules.defineRule('featCount.General',
        'featureNotes.strongheartHalflingFeatCountBonus', '+', null
      );
      rules.defineRule('featureNotes.strongheartHalflingFeatCountBonus',
        'race', '+=', 'source == "Strongheart Halfling" ? 1 : null'
      );
      rules.deleteRule('strongheartHalflingFeatures.Fortunate', 'level');
      rules.deleteRule('strongheartHalflingFeatures.Fortunate', 'race');

    } else if(race == 'Aasimar') {
      continue; //TODO

    } else if(race == 'Air Genasi') {
      continue; //TODO

    } else if(race == 'Earth Genasi') {
      continue; //TODO

    } else if(race == 'Fire Genasi') {
      continue; //TODO

    } else if(race == 'Water Genasi') {
      continue; //TODO

    } else if(race == 'Tiefling') {
      continue; //TODO

    } else
      continue;

    PH35.defineRace(rules, race, adjustment, features);
    if(notes != null) {
      rules.defineNote(notes);
    }

  }

};
