/* $Id: Realms.js,v 1.4 2007/11/08 14:22:32 Jim Exp $ */

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

  if(window.SRD35 == null) {
    alert('The Realms module requires use of the SRD35 module');
    return;
  }

  // Define a new rule set w/the same editor and standard viewer as SRD35
  var rules = new ScribeRules('Forgotten Realms');
  rules.editorElements = SRD35.initialEditorElements();
  SRD35.createViewers(rules, SRD35.VIEWERS);
  // Pick up the SRD35 rules, w/minor mods for deities and weapons
  SRD35.abilityRules(rules);
  SRD35.raceRules(rules, SRD35.LANGUAGES, Realms.RACES);
  SRD35.classRules(rules, SRD35.CLASSES);
  SRD35.companionRules(rules, SRD35.COMPANIONS);
  SRD35.skillRules(rules, SRD35.SKILLS, SRD35.SUBSKILLS);
  SRD35.featRules(rules, SRD35.FEATS, SRD35.SUBFEATS);
  SRD35.descriptionRules(rules, SRD35.ALIGNMENTS, Realms.DEITIES, SRD35.GENDERS);
  SRD35.equipmentRules
    (rules, SRD35.ARMORS, SRD35.GOODIES, SRD35.SHIELDS,
     SRD35.WEAPONS.concat(Realms.WEAPONS));
  SRD35.combatRules(rules);
  SRD35.adventuringRules(rules);
  var saved = SRD35.deitiesFavoredWeapons;
  SRD35.deitiesFavoredWeapons = Realms.deitiesFavoredWeapons;
  SRD35.magicRules(rules, SRD35.CLASSES, SRD35.DOMAINS, SRD35.SCHOOLS);
  SRD35.deitiesFavoredWeapons = saved;
  // Pick up the DMG rules, if available
  if(window.SRD35PrestigeNPC != null) {
    SRD35PrestigeNPC.npcClassRules(rules, SRD35PrestigeNPC.NPC_CLASSES);
    SRD35PrestigeNPC.prestigeClassRules
      (rules, SRD35PrestigeNPC.PRESTIGE_CLASSES);
    SRD35PrestigeNPC.companionRules(rules, SRD35PrestigeNPC.COMPANIONS);
  }
  // So far, same character creation procedures as SRD35
  rules.defineChoice('preset', 'race', 'experience', 'levels');
  rules.defineChoice('random', SRD35.RANDOMIZABLE_ATTRIBUTES);
  rules.randomizeOneAttribute = SRD35.randomizeOneAttribute;
  rules.makeValid = SRD35.makeValid;
  // Add Forgotten Realms-specific rules
  Realms.featRules(rules, Realms.FEATS, Realms.SUBFEATS);
  Realms.magicRules(rules, SRD35.CLASSES, Realms.DOMAINS);
  Realms.prestigeClassRules(rules, Realms.PRESTIGE_CLASSES);
  Realms.raceRules(rules, Realms.RACES);
  // Let Scribe know we're here
  Scribe.addRuleSet(rules);
  Realms.rules = rules;

}

// Arrays of choices
Realms.DEITIES = [
  'Akadi (N):Air/Illusion/Travel/Trickery',
  'Auril (NE):Air/Evil/Storm/Water',
  'Azuth (LN):Illusion/Magic/Knowledge/Law/Spell',
  'Bane (LE):Destruction/Evil/Hatred/Law/Tyranny',
  'Beshaba (CE):Chaos/Evil/Fate/Luck/Trickery',
  'Chauntea (NG):Animal/Earth/Good/Plant/Protection/Renewal',
  'Cyric (CE):Chaos/Destruction/Evil/Illusion/Trickery',
  'Deneir (NG):Good/Knowledge/Protection/Rune',
  'Eldath (NG):Family/Good/Plant/Protection/Water',
  'Finder Wyvernspur (CN):Chaos/Charm/Renewal/Scalykind',
  'Garagos (CN):Chaos/Destruction/Strength/War',
  'Gargauth (LE):Charm/Evil/Law/Trickery',
  'Gond (N):Craft/Earth/Fire/Knowledge/Metal/Planning',
  'Grumbar (N):Cavern/Earth/Metal/Time',
  'Gwaeron Windstrom (NG):Animal/Good/Knowledge/Plant/Travel',
  'Helm (LN):Law/Planning/Protection/Strength',
  'Hoar (LN):Fate/Law/Retribution/Travel',
  'Ilmater (LG):Good/Healing/Law/Strength/Suffering',
  'Istishia (N):Destruction/Ocean/Storm/Travel/Water',
  'Jergal (LN):Death/Fate/Law/Rune/Suffering',
  'Kelemvor (LN):Death/Fate/Law/Protection/Travel',
  'Kossuth (N):Destruction/Fire/Renewal/Suffering',
  'Lathander (NG):Good/Nobility/Protection/Renewal/Strength/Sun',
  'Lliira (CG):Chaos/Charm/Family/Good/Travel',
  'Loviatar (LE):Evil/Law/Retribution/Strength/Suffering',
  'Lurue (CG):Animal/Chaos/Good/Healing',
  'Malar (CE):Animal/Chaos/Evil/Moon/Strength',
  'Mask (NE):Darkness/Evil/Luck/Trickery',
  'Mielikki (NG):Animal/Good/Plant/Travel',
  'Milil (NG):Charm/Good/Knowledge/Nobility',
  'Mystra (NG):Good/Illusion/Knowledge/Magic/Rune/Spell',
  'Nobanion (LG):Animal/Good/Law/Nobility',
  'Oghma (N):Charm/Knowledge/Luck/Travel/Trickery',
  'Red Knight (LN):Law/Nobility/Planning/War',
  'Savras (LN):Fate/Knowledge/Law/Magic/Spell',
  'Selune (CG):Chaos/Good/Moon/Protection/Travel',
  'Shar (NE):Cavern/Darkness/Evil/Knowledge',
  'Sharess (CG):Chaos/Charm/Good/Travel/Trickery',
  'Shaundakul (CN):Air/Chaos/Portal/Protection/Trade/Travel',
  'Shiallia (NG):Animal/Good/Plant/Renewal',
  'Siamorphe (LN):Knowledge/Law/Nobility/Planning',
  'Silvanus (N):Animal/Plant/Protection/Renewal/Water',
  'Sune (CG):Chaos/Charm/Good/Protection',
  'Talona (CE):Chaos/Destruction/Evil/Suffering',
  'Talos (CE):Chaos/Destruction/Evil/Fire/Storm',
  'Tempus (CN):Chaos/Protection/Strength/War',
  'Tiamat (LE):Evil/Law/Scalykind/Tyranny',
  'Torm (LG):Good/Healing/Law/Protection/Strength',
  'Tymora (CG):Chaos/Good/Luck/Protection/Travel',
  'Tyr (LG):Knowledge/Law/Retribution/War',
  'Ubtao (N):Planning/Plant/Protection/Scalykind',
  'Ulutiu (LN):Animal/Law/Ocean/Protection/Strength',
  'Umberlee (CE):Chaos/Destruction/Evil/Ocean/Storm/Water',
  'Uthgar (CN):Animal/Chaos/Retribution/Strength/War',
  'Valkur (CG):Air/Chaos/Good/Ocean/Protection',
  'Velsharoon (NE):Death/Evil/Magic/Undeath',
  'Waukeen (N):Knowledge/Protection/Trade/Travel'
];
Realms.DOMAINS = [
  'Cavern', 'Charm', 'Craft', 'Darkness', 'Drow', 'Dwarf', 'Elf', 'Family',
  'Fate', 'Gnome', 'Halfling', 'Hatred', 'Illusion', 'Mentalism', 'Metal',
  'Moon', 'Nobility', 'Ocean', 'Orc', 'Planning', 'Portal', 'Renewal',
  'Retribution', 'Rune', 'Scalykind', 'Slime', 'Spell', 'Spider', 'Storm',
  'Suffering', 'Time', 'Trade', 'Tyranny', 'Undeath'
];
Realms.FEATS = [
  'Arcane Preparation:', 'Arcane Schooling:', 'Artist:', 'Blooded:',
  'Bloodline Of Fire:', 'Bullheaded:', 'Cosmopolitan:', 'Courteous Magocracy:',
  'Create Portal:Item Creation', 'Daylight Adaptation:',
  'Delay Spell:Metamagic', 'Discipline:', 'Education:', 'Ethran:',
  'Foe Hunter:Fighter', 'Forester:', 'Greater Spell Focus:',
  'Greater Spell Penetration:', 'Horse Nomad:Fighter:',
  'Improved Counterspell:', 'Improved Familiar:', 'Innate Spell:',
  'Inscribe Rune:Item Creation', 'Insidious Magic:Metamagic',
  'Luck Of Heroes:', 'Magical Artisan:', 'Magical Training:',
  'Mercantile Background:', 'Militia:', 'Mind Over Body:',
  'Pernicious Magic:Metamagic', 'Persistent Spell:Metamagic', 'Resist Poison:',
  'Saddleback:Fighter', 'Shadow Weave Magic:', 'Signature Spell:',
  'Silver Palm:', 'Smooth Talk:', 'Snake Blood:', 'Spellcasting Prodigy:',
  'Stealthy:', 'Street Smart:', 'Strong Soul:', 'Survivor:', 'Tattoo Focus:',
  'Tenacious Magic:Metamagic', 'Thug:', 'Thunder Twin:', 'Treetopper:',
  'Twin Spell:Metamagic', 'Twin Sword Style:Fighter'
];
Realms.LANGUAGES = [
  'Aglarondan', 'Alzhedo', 'Chessentan', 'Chondathan', 'Chultan', 'Damaran',
  'Durpari', 'Halruaan', 'Illuskan', 'Lantanese', 'Midani', 'Mulhorandi',
  'Nexalan', 'Rashemi', 'Serusan', 'Shaaran', 'Shou', 'Tashalan', 'Tuigan',
  'Turmic', 'Uluik', 'Undercommon', 'Untheric'
];
Realms.PRESTIGE_CLASSES = [
  'Arcane Devotee', 'Archmage', 'Divine Champion', 'Divine Disciple',
  'Divine Seeker', 'Guild Thief', 'Harper Scout', 'Hathran',
  'Purple Dragon Knight', 'Red Wizard', 'Runecaster', 'Shadow Adept'
];
Realms.RACES = [
  'Gold Dwarf', 'Gray Dwarf', 'Shield Dwarf', 'Drow Elf', 'Moon Elf',
  'Sun Elf', 'Wild Elf', 'Wood Elf', 'Deep Gnome', 'Rock Gnome',
  'Ghostwise Halfling', 'Lightfoot Halfling', 'Strongheart Halfling',
  'Aasimar', 'Air Genasi', 'Earth Genasi', 'Fire Genasi', 'Water Genasi',
  'Tiefling'
];
Realms.SUBFEATS = {
  'Spellcasting Prodigy':'Cleric/Druid/Sorcerer/Wizard'
};
Realms.WEAPONS = [
  'Blade Boot:1d4x2@19', 'Chakram:1d4x3@20r30', 'Claw Bracer:1d4x2@19',
  'Cutlass:1d6x2@19', 'Khopesh:1d8x2@19', 'Saber:1d8x2@19', 'Maul:1d10x3@20',
  'Scourge:1d8x2@20'
];
Realms.deitiesFavoredWeapons = {
  'Garagos':'Longsword', 'Red Knight':'Longsword', 'Tempus':'Battleaxe',
  'Tyr':'Longsword', 'Uthgar':'Battleaxe'
};
Realms.spellsSchools = {
  'Aganazzar\'s Scorcher':'Evocation', 'Analyze Portal':'Divination',
  'Anyspell':'Transmutation', 'Armor Of Darkness':'Abjuration',
  'Blacklight':'Evocation', 'Claws Of Darkness':'Illusion',
  'Cloak Of Dark Power':'Abjuration', 'Create Magic Tatoo':'Conjuration',
  'Darkbolt':'Evocation', 'Elminster\'s Evasion':'Evocation',
  'Fantastic Machine':'Illusion', 'Fire Stride':'Transmutation',
  'Flashburst':'Evocation', 'Flensing':'Evocation', 'Gate Seal':'Abjuration',
  'Gembomb':'Conjuration', 'Great Shout':'Evocation',
  'Greater Anyspell':'Transmutation', 'Greater Fantastic Machine':'Illusion',
  'Grimwald\'s Graymantle':'Necromancy', 'Lesser Ironguard':'Abjuration',
  'Maelstrom':'Conjuration', 'Maw Of Stone':'Transmutation',
  'Moon Blade':'Evocation', 'Moon Path':'Evocation', 'Moonbeam':'Evocation',
  'Moon Fire':'Evocation', 'Scatterspray':'Transmutation',
  'Shadow Mask':'Illusion', 'Shadow Spray':'Illusion',
  'Snilloc\'s Snowball Swarm':'Evocation', 'Spider Curse':'Transmutation',
  'Spider Shapes':'Transmutation', 'Spiderform':'Transmutation',
  'Stone Spiders':'Transmutation', 'Thunderlance':'Evocation',
  'Waterspout':'Conjuration'
};

Realms.featRules = function(rules, feats, subfeats) {

  var allFeats = [];
  for(var i = 0; i < feats.length; i++) {
    var pieces = feats[i].split(':');
    var feat = pieces[0];
    var featSubfeats = subfeats[feat];
    if(featSubfeats == null) {
      allFeats[allFeats.length] = feat + ':' + pieces[1];
    } else if(featSubfeats != '') {
      featSubfeats = featSubfeats.split('/');
      for(var j = 0; j < featSubfeats.length; j++) {
        allFeats[allFeats.length] =
          feat + ' (' + featSubfeats[j] + '):' + pieces[1];
      }
    }
  }

  for(var i = 0; i < allFeats.length; i++) {
    var pieces = allFeats[i].split(':');
    var feat = pieces[0];
    var matchInfo;
    var notes;
    if(feat == 'Arcane Preparation') {
      // TODO
    } else if(feat == 'Arcane Schooling') {
      // TODO
    } else if(feat == 'Artist') {
      // TODO
    } else if(feat == 'Blooded') {
      // TODO
    } else if(feat == 'Bloodline Of Fire') {
      // TODO
    } else if(feat == 'Bullheaded') {
      // TODO
    } else if(feat == 'Cosmopolitan') {
      // TODO
    } else if(feat == 'Courteous Magocracy') {
      // TODO
    } else if(feat == 'Create Portal') {
      // TODO
    } else if(feat == 'Daylight Adaptation') {
      // TODO
    } else if(feat == 'Delay Spell') {
      // TODO
    } else if(feat == 'Discipline') {
      // TODO
    } else if(feat == 'Education') {
      // TODO
    } else if(feat == 'Ethran') {
      // TODO
    } else if(feat == 'Foe Hunter') {
      // TODO
    } else if(feat == 'Forester') {
      // TODO
    } else if(feat == 'Greater Spell Focus') {
      // TODO
    } else if(feat == 'Greater Spell Penetration') {
      // TODO
    } else if(feat == 'Horse Nomad') {
      // TODO
    } else if(feat == 'Improved Counterspell') {
      // TODO
    } else if(feat == 'Improved Familiar') {
      // TODO
    } else if(feat == 'Innate Spell') {
      // TODO
    } else if(feat == 'Inscribe Rune') {
      // TODO
    } else if(feat == 'Insidious Magic') {
      // TODO
    } else if(feat == 'Luck Of Heroes') {
      // TODO
    } else if(feat == 'Magical Artisan') {
      // TODO
    } else if(feat == 'Magical Training') {
      // TODO
    } else if(feat == 'Mercantile Background') {
      // TODO
    } else if(feat == 'Militia') {
      // TODO
    } else if(feat == 'Mind Over Body') {
      // TODO
    } else if(feat == 'Pernicious Magic') {
      // TODO
    } else if(feat == 'Persistent Spell') {
      // TODO
    } else if(feat == 'Resist Poison') {
      // TODO
    } else if(feat == 'Saddleback') {
      // TODO
    } else if(feat == 'Shadow Weave Magic') {
      // TODO
    } else if(feat == 'Signature Spell') {
      notes = [
        'magicNotes.signatureSpellFeature:' +
          'Convert arcane spells into specified mastered spell',
        'validationNotes.signatureSpellFeatFeatures:Requires Spell Mastery'
      ];
    } else if(feat == 'Silver Palm') {
      notes = [
        'sanityNotes.silverPalmFeatSkills:Requires Appraisal||Bluff',
        'skillNotes.silverPalmFeature:+2 Appraisal/Bluff'
      ];
    } else if(feat == 'Smooth Talk') {
      notes = [
        'sanityNotes.smoothTalkFeatSkills:Requires Diplomacy||Sense Motive',
        'skillNotes.smoothTalkFeature:+2 Diplomacy/Sense Motive'
      ];
    } else if(feat == 'Snake Blood') {
      notes = [
        'saveNotes.snakeBloodFeature:+1 Reflex/+2 poison'
      ];
      rules.defineRule('save.Reflex', 'saveNotes.snakeBloodFeature', '+', '1');
      rules.defineRule
        ('resistance.Poison', 'saveNotes.snakeBloodFeature', '+=', '2');
    } else if((matchInfo =
               feat.match(/^Spellcasting Prodigy \((.*)\)$/)) != null) {
      var klass = matchInfo[1];
      var klassNoSpace = klass.replace(/ /g, '');
      var note = 'magicNotes.spellcastingProdigy(' + klassNoSpace + ')Feature';
      notes = [
        note + ':+1 spell DC',
        'sanityNotes.spellcastingProdigy('+klassNoSpace+')FeatCasterLevel:' +
          'Requires Caster Level >= 1'
      ];
      rules.defineRule('spellDifficultyClass.' + klass, note, '+', '1');
    } else if(feat == 'Stealthy') {
      notes = [
        'sanityNotes.stealthyFeatSkills:Requires Hide||Move Silently',
        'skillNotes.stealthyFeature:+2 Hide/Move Silently Information'
      ];
    } else if(feat == 'Street Smart') {
      notes = [
        'sanityNotes.stealthyFeatSkills:Requires Bluff|Gather Information',
        'skillNotes.streetSmartFeature:+2 Bluff/Gather Information'
      ];
    } else if(feat == 'Strong Soul') {
      notes = [
        'saveNotes.strongSoulFeature:+1 Fortitude/Will and +2 draining/death'
      ];
      rules.defineRule
        ('save.Fortitude', 'saveNotes.strongSoulFeature', '+', '1');
      rules.defineRule
        ('save.Will', 'saveNotes.strongSoulFeature', '+', '1');
    } else if(feat == 'Survivor') {
      notes = [
        'saveNotes.survivorFeature:+1 Fortitude',
        'skillNotes.survivorFeature:+2 Survival'
      ];
      rules.defineRule('save.Fortitude', 'saveNotes.survivorFeature', '+', '1');
    } else if(feat == 'Tattoo Focus') {
      notes = [
        'magicNotes.tattooFocusFeature:' +
          '+1 DC/+1 caster level vs. resistance w/specialization school spells',
        'validationNotes.tattooFocusMagic:Requires magic school specialization'
      ];
      rules.defineRule('validationNotes.tattooFocusMagic',
        'feats.Tattoo Focus', '=', '-1',
        /^specialize\./, '+', '1',
        '', 'v', '0'
      );
    } else if(feat == 'Tenacious Magic') {
      notes = [
        'magicNotes.tenaciousMagicFeature:' +
          'Foe requires DC %V to dispel weave magic spell',
        'sanityNotes.tenaciousMagicFeatCasterLevel:Requires Caster Level >= 1',
        'validationNotes.tenaciousMagicFeatFeatures:Requires Shadow Weave Magic'
      ];
      rules.defineRule
        ('magicNotes.tenaciousMagicFeature', 'casterLevel', '=', '15 + source');
    } else if(feat == 'Thug') {
      notes = [
        'combatNotes.thugFeature:+2 Initiative',
        'skillNotes.thugFeature:+2 Intimidate'
      ];
      rules.defineRule('initiative', 'combatNotes.thugFeature', '+', '2');
    } else if(feat == 'Thunder Twin') {
      notes = [
        'abilityNotes.thunderTwinFeature:+2 charisma checks',
        'skillNotes.thunderTwinFeature:' +
          'DC 15 Intuit Direction to determine direction of twin',
        'validationNotes.thunderTwinFeatRace:' +
          'Requires Race =~ Gold Dwarf|Shield Dwarf'
      ];
    } else if(feat == 'Treetopper') {
      notes = [
        'sanityNotes.treetopperFeatureSkills:Requires Climb',
        'skillNotes.treetopperFeature:+2 Climb'
      ];
    } else if(feat == 'Twin Spell') {
      notes = [
        'magicNotes.twinSpellFeature:Spell affect as if two spells cast',
        'sanityNotes.twinSpellFeatCasterLevel:Requires Caster Level >= 1'
      ];
    } else if(feat == 'Twin Sword Style') {
      notes = [
        'combatNotes.twinSwordStyleFeature:' +
          '+2 AC vs. designated foe when using two swords',
        'validationNotes.twinSwordStyleFeature:Requires Two Weapon Fighting'
      ];
    } else
      continue;
    rules.defineChoice('feats', feat + ':' + pieces[1]);
    rules.defineRule('features.' + feat, 'feats.' + feat, '=', null);
    if(notes != null)
      rules.defineNote(notes);
  }

};

Realms.magicRules = function(rules, classes, domains) {

  var schools = rules.getChoices('schools');

  for(var i = 0; i < classes.length; i++) {
    var klass = classes[i];
    var spells;
    if(klass == 'Bard') {
      spells = [
        'B2:Eagle\'s Splendor',
        'B3:Analyze Portal',
        'B6:Gate Seal:Great Shout'
      ];
    } else if(klass == 'Cleric') {
      spells = [
        'C6:Gate Seal'
      ];
    } else if(klass == 'Druid') {
      spells = [
        'D6:Gate Seal'
      ];
    } else if(klass == 'Sorcerer' || klass == 'Wizard') {
      // Identical spell lists
      spells = [
        'W1:Scatterspray',
        'W2:Aganazzar\'s Scorcher:Claws Of Darkness:Create Magic Tatoo:' +
        'Eagle\'s Splendor:Shadow Mask:Shadow Spray:Snilloc\'s Snowball Swarm',
        'W3:Analyze Portal:Blacklight:Flashburst',
        'W4:Fire Stride:Thunderlance',
        'W5:Grimwald\'s Graymantle:Lesser Ironguard',
        'W6:Gate Seal',
        'W8:Flensing:Great Shout',
        'W9:Elminster\'s Evasion'
      ];
    }
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = Realms.spellsSchools[spell];
          if(school == null && (school = SRD35.spellsSchools[spell]) == null) {
            alert("Reject unknown spell '" + spell + "'");
            continue;
          }
          spell += '(' + pieces[0] + ' ' +
                    (school == 'Universal' ? 'None' : schools[school]) + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }
  }

  for(var i = 0; i < domains.length; i++) {
    var domain = domains[i];
    var notes;
    var spells;
    var turn;
    if(domain == 'Cavern') {
      notes = [
        'skillNotes.cavernDomain:' +
          '+2 Search involving stone or metal/automatic check w/in 10 ft'
      ];
      spells = [
        'Detect Secret Doors', 'Darkness', 'Meld Into Stone',
        'Leomund\'s Secret Shelter', 'Passwall', 'Find The Path',
        'Maw Of Stone', 'Earthquake', 'Imprisonment'
      ];
      turn = null;
    } else if(domain == 'Charm') {
      notes = [
        'abilityNotes.charmDomain:Boost charisma by 4 for 1 minute 1/day'
      ];
      spells = [
        'Charm Person', 'Calm Emotions', 'Suggestions', 'Emotion',
        'Charm Monster', 'Geas/Quest', 'Insanity', 'Demand', 'Dominate Monster'
      ];
      turn = null;
    } else if(domain == 'Craft') {
      notes = [
        'magicNotes.craftDomain:+1 caster level creation spells',
        'skillNotes.craftDomain:+2 on one Craft skill'
      ];
      spells = [
        'Animate Rope', 'Wood Shape', 'Stone Shape', 'Minor Creation',
        'Wall Of Stone', 'Fantastic Machine', 'Major Creation', 'Forcecage',
        'Greater Fantastic Machine'
      ];
      turn = null;
    } else if(domain == 'Darkness') {
      notes = [
        'combatNotes.blindFightFeature:' +
          'Reroll concealed miss/no bonus to invisible foe/half penalty for ' +
          'impaired vision',
        'featureNotes.darknessDomain:Blind Fight bonus feat'
      ];
      spells = [
        'Obscuring Mist', 'Blindness/Deafness', 'Blacklight',
        'Armor Of Darkness', 'Darkbolt', 'Prying Eyes', 'Nightmare',
        'Power Word, Blind', 'Power Word, Kill'
      ];
      turn = null;
      rules.defineRule('features.Blind Fight', 'domains.Darkness', '=', '1');
    } else if(domain == 'Drow') {
      notes = [
        'featureNotes.drowDomain:Lightning Reflexes bonus feat',
        'saveNotes.lightningReflexesFeature:+2 Reflex'
      ];
      spells = [
        'Cloak Of Dark Power', 'Clairaudience/Clairvoyance', 'Suggestion',
        'Discern Lies', 'Spiderform', 'Greater Dispelling', 'Word Of Chaos',
        'Greater Planar Ally', 'Gate'
      ];
      turn = null;
      rules.defineRule('features.Lightning Reflexes', 'domains.Drow', '=', '1');
      rules.defineRule
        ('save.Reflex', 'saveNotes.lightningReflexesFeature', '+', '2');
    } else if(domain == 'Dwarf') {
      notes = [
        'featureNotes.dwarfDomain:Great Fortitude bonus feat',
        'saveNotes.greatFortitudeFeature:+2 Fortitude'
      ];
      spells = [
        'Magic Weapon', 'Endurance', 'Glyph Of Warding', 'Greater Magic Weapon',
        'Fabricate', 'Stone Tell', 'Dictum', 'Protection From Spells',
        'Elemental Swarm'
      ];
      turn = null;
      rules.defineRule('features.Great Fortitude', 'domains.Dwarf', '=', '1');
      rules.defineRule
        ('save.Fortitude', 'saveNotes.greatFortitudeFeature', '+', '2');
    } else if(domain == 'Elf') {
      notes = [
        'combatNotes.pointBlankShotFeature:+1 ranged attack/damage w/in 30 ft',
        'featureNotes.elfDomain:Point Blank Shot bonus feat'
      ];
      spells = [
        'True Strike', 'Cat\'s Grace', 'Snare', 'Tree Stride',
        'Commune With Nature', 'Find The Path', 'Liveoak', 'Sunburst',
        'Antipathy'
      ];
      turn = null;
      rules.defineRule('features.Point Blank Shot', 'domains.Elf', '=', '1');
    } else if(domain == 'Family') {
      notes = [
        'magicNotes.familyDomain:' +
          'Add 4 to AC of %V creaters w/in 10 ft for %1 rounds 1/day'
      ];
      spells = [
        'Bless', 'Shield Other', 'Helping Hand', 'Imbue With Spell Ability',
        'Rary\'s Mnemonic Enhancer', 'Heroes\' Feast', 'Refuge',
        'Protection From Spells', 'Prismatic Sphere'
      ];
      turn = null;
      rules.defineRule('magicNotes.familyDomain',
        'charismaModifier', '=', 'source > 1 ? source : 1'
      );
      rules.defineRule('magicNotes.familyDomain.1', 'level', '=', null);
    } else if(domain == 'Fate') {
      notes = [
        'combatNotes.fateDomain:Always adds dexterity modifier to AC'
      ];
      spells = [
        'True Strike', 'Augury', 'Bestow Curse', 'Status', 'Mark Of Justice',
        'Geas/Quest', 'Vision', 'Mind Blank', 'Foresight'
      ];
      turn = null;
    } else if(domain == 'Gnome') {
      notes = [
        'magicNotes.gnomeDomain:+1 caster level illusion spells'
      ];
      spells = [
        'Silent Image', 'Gembomb', 'Minor Image', 'Minor Creation',
        'Hallucinatory Terrain', 'Fantastic Machine', 'Screen',
        'Otto\'s Irresistable Dance', 'Summon Nature\'s Ally'
      ];
      turn = null;
    } else if(domain == 'Halfling') {
      notes = [
        'skillNotes.halflingDomain:' +
          'Add %V to Climb/Hide/Jump/Move Silently for 10 minutes 1/day'
      ];
      spells = [
        'Magic Stone', 'Cat\'s Grace', 'Magic Vestment', 'Freedom Of Movement',
        'Mordenkainen\'s Faithful Houn', 'Move Earth', 'Shadow Walk',
        'Word Of Recall', 'Foresight'
      ];
      turn = null;
      rules.defineRule('skillNotes.halflingDomain',
        'charismaModifier', '=', 'source >= 1 ? source : null'
      );
    } else if(domain == 'Hatred') {
      notes = [
        'combatNotes.hatredDomain:+2 attack/AC vs. one foe for 1 minute 1/day',
        'saveNotes.hatredDomain:+2 saves vs. one foe for 1 minute 1/day'
      ];
      spells = [
        'Doom', 'Scare', 'Bestow Curse', 'Emotion', 'Righteous Might',
        'Forbiddance', 'Blasphemy', 'Antipathy', 'Wail Of The Banshee'
      ];
      turn = null;
    } else if(domain == 'Illusion') {
      notes = [
        'magicNotes.illusionDomain:+1 caster level illusion spells'
      ];
      spells = [
        'Silent Image', 'Minor Image', 'Displacement', 'Phantasmal Killer',
        'Persistent Image', 'Mislead', 'Project Image', 'Screen', 'Weird'
      ];
      turn = null;
    } else if(domain == 'Mentalism') {
      notes = [
        'magicNotes.mentalismDomain:' +
          'Touch to allow target +%V on next Will save for 1 hour 1/day'
      ];
      spells = [
        'Random Action', 'Detect Thoughts', 'Clairaudience/Clairvoyance',
        'Modify Memory', 'Mind Fog', 'Rary\'s Telepathic Bond', 'Antipathy',
        'Mind Blank', 'Astral Projection'
      ];
      turn = null;
      rules.defineRule
        ('magicNotes.mentalismDomain', 'level', '=', 'source + 2');
    } else if(domain == 'Metal') {
      notes = [
        'featureNotes.metalDomain:' +
          'Weapon Proficiency/Focus with choice of hammer'
      ];
      spells = [
        'Magic Weapon', 'Heat Metal', 'Keen Edge', 'Rusting Grasp',
        'Wall Of Iron', 'Blade Barrier', 'Transmute Metal To Wood',
        'Iron Body', 'Repel Metal Or Stone'
      ];
      turn = null;
      // TODO add to feat count for additional Weapon Proficiency/Focus?
    } else if(domain == 'Moon') {
      notes = null;
      spells = [
        'Faerie Fire', 'Moonbeam', 'Moon Blade', 'Emotion', 'Moon Path',
        'Permanent Image', 'Insanity', 'Animal Shapes', 'Moonfire'
      ];
      turn = 'Lycanthropes';
    } else if(domain == 'Nobility') {
      notes = [
        'magicNotes.nobilityDomain:' +
          '+2 allies\' attack/damage/skill/ability for %V rounds 1/day'
      ];
      spells = [
        'Divine Favor', 'Enthrall', 'Magic Vestment', 'Discern Lies',
        'Greater Command', 'Geas/Quest', 'Repulsion', 'Demand',
        'Storm Of Vengeance'
      ];
      turn = null;
      rules.defineRule('magicNotes.nobilityDomain',
        'charismaModifier', '=', 'source >= 1 ? source : null'
      );
    } else if(domain == 'Ocean') {
      notes = [
        'magicNotes.oceanDomain:<i>Water Breathing</i> %V rounds/day'
      ];
      spells = [
        'Endure Elements', 'Sound Burst', 'Water Breathing',
        'Freedom Of Movement', 'Wall Of Ice', 'Otiluke\'s Freezing Sphere',
        'Waterspout', 'Maelstrom', 'Elemental Swarm'
      ];
      turn = null;
      rules.defineRule('magicNotes.oceanDomain', 'level', '=', '10 * source');
    } else if(domain == 'Orc') {
      notes = [
        'combatNotes.orcDomain:+%V (+%1 vs. dwarf/elf) smite damage 1/day'
      ];
      spells = [
        'Cause Fear', 'Produce Flame', 'Prayer', 'Divine Power', 'Prying Eyes',
        'Eyebite', 'Blasphemy', 'Cloak Of Chaos', 'Power Word, Kill'
      ];
      turn = null;
      rules.defineRule('combatNotes.orcDomain', 'levels.Cleric', '=', null);
      rules.defineRule
        ('combatNotes.orcDomain.1', 'levels.Cleric', '=', 'source + 4');
    } else if(domain == 'Planning') {
      notes = [
        'featureNotes.planningDomain:Extend Spell bonus feat',
        'magicNotes.extendSpellFeature:x2 designated spell duration'
      ];
      spells = [
        'Deathwatch', 'Augury', 'Clairaudiance/Clairvoyance', 'Status',
        'Detect Scrying', 'Heroes\' Feast', 'Greater Scrying',
        'Discern Location', 'Time Stop'
      ];
      turn = null;
      rules.defineRule
        ('features.Extend Spell', 'featureNotes.planningDomain', '=', '1');
    } else if(domain == 'Portal') {
      notes = [
        'featureNotes.portalDomain:DC 20 check to detect in/active portals'
      ];
      spells = [
        'Summon Monster I', 'Analyze Portal', 'Dimensional Anchor',
        'Dimension Door', 'Teleport', 'Banishment', 'Etherealness', 'Maze',
        'Gate'
      ];
      turn = null;
    } else if(domain == 'Renewal') {
      notes = [
        'combatNotes.renewalDomain:Add d8+%V to negative hit points 1/day'
      ];
      spells = [
        'Charm Person', 'Lesser Restoration', 'Remove Disease', 'Reincarnate',
        'Atonement', 'Heroes\' Feast', 'Greater Restoration',
        'Ploymorph Any Object'
      ];
      turn = null;
      rules.defineRule
        ('combatNotes.renewalDomain', 'charismaModifier', '=', null);
    } else if(domain == 'Retribution') {
      notes = [
        'combatNotes.retributionDomain:' +
          'Successful attack does maximum damage to injuring foe 1/day'
      ];
      spells = [
        'Shield Of Faith', 'Endurance', 'Speak With Dead', 'Fire Shield',
        'Mark Of Justice', 'Banishment', 'Spell Turning', 'Discern Location',
        'Storm Of Vengeance'
      ];
      turn = null;
    } else if(domain == 'Rune') {
      notes = [
        'featureNotes.runeDomain:Scribe Scroll bonus feat',
        'magicNotes.scribeScrollFeature:Create scroll of any known spell'
      ];
      spells = [
        'Erase', 'Secret Page', 'Glyph Of Warding', 'Explosive Runes',
        'Lesser Planar Binding', 'Greater Glyph Of Warding',
        'Drawmij\'s Instant Summons', 'Symbol', 'Teleportation Circle'
      ];
      turn = null;
      rules.defineRule
        ('features.Scribe Scroll', 'featureNotes.runeDomain', '=', '1');
    } else if(domain == 'Scalykind') {
      notes = null;
      spells = [
        'Magic Fang', 'Animal Trance', 'Greater Magic Fang', 'Poison',
        'Animal Growth', 'Eyebite', 'Creeping Doom', 'Animal Shapes',
        'Shapechange'
      ];
      turn = 'Reptiles';
    } else if(domain == 'Slime') {
      notes = null;
      spells = [
        'Grease', 'Melf\'s Acid Arrow', 'Poison', 'Rusting Grasp',
        'Evard\'s Black Tentacles', 'Transmute Rock To Mud', 'Destruction',
        'Power Word, Blind', 'Implosion'
      ];
      turn = 'Oozes';
    } else if(domain == 'Spell') {
      notes = [
        'skillNotes.spellDomain:+2 Concentration/Spellcraft'
      ];
      spells = [
        'Mage Armor', 'Silence', 'Anyspell', 'Rary\'s Mnemonic Enhancer',
        'Break Enchantment', 'Greater Anyspell', 'Limited Wish',
        'Antimagic Field'
      ];
      turn = null;
    } else if(domain == 'Spider') {
      notes = null;
      spells = [
        'Spider Climb', 'Summon Swarm', 'Phantom Steed', 'Giant Vermin',
        'Insect Plague', 'Spider Curse', 'Stone Spiders', 'Creeping Doom',
        'Spider Shapes'
      ];
      turn = 'Spiders';
    } else if(domain == 'Storm') {
      notes = [
        'saveNotes.stormDomain:Electricity resistance 5'
      ];
      spells = [
        'Entropic Shield', 'Gust Of Wind', 'Call Lightning', 'Sleet Storm',
        'Ice Storm', 'Summon Monster VI', 'Control Weather', 'Whirlwind',
        'Storm Of Vengeance'
      ];
      turn = null;
    } else if(domain == 'Suffering') {
      notes = [
        'combatNotes.sufferingDomain:' +
           'Touch attack causes -2 strength/dexterity 1/day'
      ];
      spells = [
        'Bane', 'Endurance', 'Bestow Curse', 'Enervation', 'Feeblemind',
        'Harm', 'Eyebite', 'Symbol Of Pain', 'Horrid Wilting'
      ];
      turn = null;
    } else if(domain == 'Time') {
      notes = [
        'combatNotes.improvedInitiativeFeature:+4 initiative',
        'featureNotes.timeDomain:Improved Initiative bonus feat'
      ];
      spells = [
        'True Strike', 'Gentle Repose', 'Haste', 'Freedom Of Movement',
        'Permanency', 'Contingency', 'Mass Haste', 'Foresight', 'Time Stop'
      ];
      turn = null;
      rules.defineRule
        ('features.Improved Initiative', 'featureNotes.timeDomain', '=', '1');
      rules.defineRule
        ('initiative', 'combatNotes.improvedInitiativeFeature', '+', '4');
    } else if(domain == 'Trade') {
      notes = [
        'magicNotes.tradeDomain:' +
          '<i>Detect Thoughts</i> on 1 target for %V minutes 1/day'
      ];
      spells = [
        'Message', 'Gembomb', 'Eagle\'s Splendor', 'Sending', 'Fabricate',
        'Tree Seeing', 'Mordenkainen\'s Magnificent Mansion', 'Mind Blank',
        'Discern Location'
      ];
      turn = null;
      rules.defineRule('magicNotes.tradeDomain',
        'charismaModifier', '=', 'source >= 1 ? source : null'
      );
    } else if(domain == 'Tyranny') {
      notes = [
        'magicNotes.tyrannyDomain:+2 compulsion spell DC'
      ];
      spells = [
        'Command', 'Enthrall', 'Discern Lies', 'Fear', 'Greater Command',
        'Geas/Quest', 'Bigby\'s Grasping Hand', 'Mass Charm', 'Dominate Monster'
      ];
      turn = null;
    } else if(domain == 'Undeath') {
      notes = [
        'combatNotes.extraTurningFeature:+4/day',
        'featureNotes.undeathDomain:Extra Turning bonus feat'
      ];
      spells = [
        'Detect Undead', 'Desecrate', 'Animate Dead', 'Death Ward',
        'Circle Of Doom', 'Create Undead', 'Control Undead',
        'Create Greater Undead', 'Energy Drain'
      ];
      turn = null;
      rules.defineRule
        ('features.Extra Turning', 'featureNotes.undeathDomain', '=', '1');
      rules.defineRule(/^turn.*\.frequency$/,
        'combatNotes.extraTurningFeature', '+', '4 * source'
      );
    } else
      continue;
    rules.defineChoice('domains', domain);
    if(notes != null) {
      rules.defineNote(notes);
    }
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var spell = spells[j];
        var school = Realms.spellsSchools[spell];
        if(school == null) {
          school = SRD35.spellsSchools[spell];
        }
        if(school == null) {
          continue;
        }
        spell += '(' + domain + (j + 1) + ' ' +
                  (school == 'Universal' ? 'Univ' : schools[school]) + ')';
        rules.defineChoice('spells', spell);
      }
    }
    if(turn != null) {
      var prefix = 'turn' + turn;
      rules.defineRule(prefix + '.level',
        'domains.' + domain, '?', null,
        'levels.Cleric', '+=', null
      );
      rules.defineRule('turningLevel', prefix + '.level', '^=', null);
      rules.defineRule(prefix + '.damageModifier',
        prefix + '.level', '=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule(prefix + '.frequency',
        prefix + '.level', '=', '3',
        'charismaModifier', '+', null
      );
      rules.defineRule(prefix + '.maxHitDice',
        prefix + '.level', '=', 'source * 3 - 10',
        'charismaModifier', '+', null
      );
      rules.defineNote([
        prefix + '.damageModifier:2d6+%V',
        prefix + '.frequency:%V/day',
        prefix + '.maxHitDice:(d20+%V)/3'
      ]);
    }
  }

};

Realms.prestigeClassRules = function(rules, classes) {
  // TODO
  /*
  'Arcane Devotee', 'Archmage', 'Divine Champion', 'Divine Disciple',
  'Divine Seeker', 'Guild Thief', 'Harper Scout', 'Hathran',
  'Purple Dragon Knight', 'Red Wizard', 'Runecaster', 'Shadow Adept'
  */
};

Realms.raceRules = function(rules, races) {

  for(var i = 0; i < races.length; i++) {

    var adjustment, features, notes;
    var race = races[i];
    var raceNoSpace =
      race.substring(0,1).toLowerCase() + race.substring(1).replace(/ /g, '');

    if(race == 'Gold Dwarf') {
      adjustment = '+2 constitution/-2 dexterity';
      features = ['Gold Dwarf Favored Enemy'];
      notes = [
        'combatNotes.goldDwarfFavoredEnemyFeature:+1 attack vs. aberrations'
      ];
      delete
        rules.getChoices('notes')['abilityNotes.goldDwarfAbilityAdjustment'];
      rules.deleteRule('charisma', 'abilityNotes.goldDwarfAbilityAdjustment');
      rules.deleteRule('goldDwarfFeatures.Dwarf Favored Enemy', 'level');
      rules.deleteRule('goldDwarfFeatures.Dwarf Favored Enemy', 'race');

    } else if(race == 'Gray Dwarf') {
      adjustment = '+2 constitution/-4 charisma';
      features = [
        'Aware', 'Darkvision', 'Level Adjustment', 'Light Sensitivity',
        'Magic Poison Immunity', 'Natural Spells', 'Noiseless',
        'Paralysis Immunity', 'Phantasm Immunity'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'combatNotes.lightSensitivityFeature:-2 attack in daylight',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'saveNotes.magicPoisonImmunityFeature:' +
          'Immune to magical/alchemaic poisions',
        'saveNotes.lightSensitivityFeature:-2 saving throws in daylight',
        'saveNotes.paralysisImmunityFeature:Immune to paralysis',
        'saveNotes.phantasmImmunityFeature:Immune to phantasms',
        'skillNotes.awareFeature:+1 Listen/Spot',
        'skillNotes.lightSensitivityFeature:-2 checks in daylight',
        'skillNotes.noiselessFeature:+4 Move Silently'
      ];
      delete
        rules.getChoices('notes')['abilityNotes.grayDwarfAbilityAdjustment'];
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'grayDwarfFeatures.Level Adjustment', '=', '-2'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'grayDwarfFeatures.Darkvision', '+=', '120'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'grayDwarfFeatures.Natural Spells', '=', 
        '"<i>Enlarge</i>/<i>Invisibility</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1',
        'level', '=', null,
        'grayDwarfFeatures.Natural Spells', '*', '2'
      );

    } else if(race == 'Shield Dwarf') {
      adjustment = null;
      features = null;
      notes = null;

    } else if(race == 'Drow Elf') {
      adjustment = '+2 dexterity/-2 constitution/+2 intelligence/+2 charisma';
      delete rules.getChoices('notes')['abilityNotes.drowElfAbilityAdjustment'];
      features = [
        'Darkvision', 'Drow Spell Resistance', 'Level Adjustment',
        'Light Blindness', 'Natural Spells', 'Strong Will'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'featureNotes.lightBlindnessFeature:Blind 1 round from sudden daylight',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'saveNotes.drowSpellResistanceFeature:DC %V',
        'saveNotes.strongWillFeature:+2 Will vs. spells'
      ];
      rules.deleteRule('drowElfFeatures.Low Light Vision', 'level');
      rules.deleteRule('drowElfFeatures.Low Light Vision', 'race');
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'drowFeatures.Level Adjustment', '=', '-2'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'drowElfFeatures.Darkvision', '+=', '120'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'drowElfFeatures.Natural Spells', '=', 
        '"<i>Dancing Lights</i>/<i>Darkness</i>/<i>Faerie Fire</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1', 'level', '=', null);
      rules.defineRule
        ('saveNotes.drowSpellResistanceFeature', 'level', '=', '11 + source');

    } else if(race == 'Moon Elf') {
      adjustment = null;
      features = null;
      notes = null;

    } else if(race == 'Sun Elf') {
      adjustment = '+2 intelligence/-2 constitution';
      features = null;
      notes = null;
      delete
        rules.getChoices('notes')['abilityNotes.sunElfAbilityAdjustment'];
      rules.deleteRule('dexterity', 'abilityNotes.sunElfAbilityAdjustment');

    } else if(race == 'Wild Elf') {
      adjustment = '+2 dexterity/-2 intelligence';
      features = null;
      notes = null;
      delete
        rules.getChoices('notes')['abilityNotes.wildElfAbilityAdjustment'];
      rules.deleteRule('constitution', 'abilityNotes.sunElfAbilityAdjustment');

    } else if(race == 'Wood Elf') {
      adjustment =
        '+2 strength/+2 dexterity/-2 constitution/-2 intelligence/-2 charisma';
      features = null;
      notes = null;
      delete
        rules.getChoices('notes')['abilityNotes.woodElfAbilityAdjustment'];

    } else if(race == 'Deep Gnome') {
      adjustment = '-2 strength/+2 dexterity/+2 wisdom/-4 charisma';
      features = [
        'Darkvision', 'Exceptional Dodge', 'Extra Luck', 'Level Adjustment',
        'Natural Spells', 'Nondetection', 'Shadowy', 'Sneaky', 'Stonecunning',
        'Svirfneblin Spell Resistance'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'combatNotes.exceptionalDodgeFeature:+4 AC',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'magicNotes.nondetectionFeature:Continuous <i>Nondetection</i>',
        'saveNotes.extraLuckFeature:+2 all saves',
        'saveNotes.svirfneblinSpellResistanceFeature:DC %V',
        'skillNotes.shadowyFeature:+2 Hide in darkened underground areas',
        'skillNotes.sneakyFeature:+2 Hide',
        'skillNotes.stonecunningFeature:' +
          '+2 Search involving stone or metal/automatic check w/in 10 ft'
      ];
      delete
        rules.getChoices('notes')['abilityNotes.deepGnomeAbilityAdjustment'];
      rules.deleteRule('deepGnomeFeatures.Dodge Giants', 'level');
      rules.deleteRule('deepGnomeFeatures.Dodge Giants', 'race');
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'deepGnomeFeatures.Level Adjustment', '=', '-3'
      );
      rules.defineRule
        ('armorClass', 'combatNotes.exceptionalDodgeFeature', '+', '4');
      rules.defineRule('featureNotes.darkvisionFeature',
        'deepGnomeFeatures.Darkvision', '+=', '120'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'deepGnomeFeatures.Natural Spells', '=', 
        '"<i>Dancing Lights</i>/<i>Darkness</i>/<i>Faerie Fire</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1', 'level', '=', null);
      rules.defineRule
        ('save.Fortitude', 'saveNotes.extraLuckFeature', '+', '2');
      rules.defineRule('save.Reflex', 'saveNotes.extraLuckFeature', '+', '2');
      rules.defineRule('save.Will', 'saveNotes.extraLuckFeature', '+', '2');
      rules.defineRule('saveNotes.svirfneblinSpellResistanceFeature',
        'level', '=', '11 + source'
      );

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
      adjustment = '+2 wisdom/+2 charisma';
      features = [
        'Alert', 'Darkvision', 'Level Adjustment', 'Natural Spells', 'Outsider'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'skillNotes.alertFeature:+2 Listen/Spot'
      ];
      // TODO acid, cold, electricty resistance 5
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'aasimarFeatures.Level Adjustment', '=', '-1'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'aasimarFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'aasimarFeatures.Natural Spells', '=', '"<i>Light</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1', 'level', '=', null);

    } else if(race == 'Air Genasi') {
      adjustment = '+2 dexterity/+2 intelligence/-2 wisdom/-2 charisma';
      features = [
        'Breathless', 'Darkvision', 'Level Adjustment', 'Natural Spells',
        'Outsider', 'Resist Air'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'saveNotes.breathlessFeature:' +
          'Immune drowning/suffocation/inhalation effects',
        'saveNotes.resistAirFeature:+%V vs. air spells',
        'validationNotes.airGenasiRaceDomains:Requires Air'
      ];
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'airGenasiFeatures.Level Adjustment', '=', '-1'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'airGenasiFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'airGenasiFeatures.Natural Spells', '=', '"<i>Levitate</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1',
        'airGenasiFeatures.Natural Spells', '=', '5'
      );
      rules.defineRule
        ('resistance.Air', 'saveNotes.resistAirFeature', '+=', null);
      rules.defineRule('saveNotes.resistAirFeature',
        'level', '*', 'Math.floor((source + 4) / 5)'
      );
      rules.defineRule('validationNotes.airGenasiRaceDomains',
        'race', '=', 'source == "Air Genasi" ? -1 : null',
        'levels.Cleric', '?', null,
        'domains.Air', '+', '1'
      );

    } else if(race == 'Earth Genasi') {
      adjustment = '+2 strength/+2 constitution/-2 wisdom/-2 charisma';
      features = [
        'Darkvision', 'Level Adjustment', 'Natural Spells', 'Outsider',
        'Resist Earth'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'saveNotes.resistEarthFeature:+%V vs. earth spells',
        'validationNotes.earthGenasiRaceDomains:Requires Earth'
      ];
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'earthGenasiFeatures.Level Adjustment', '=', '-1'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'earthGenasiFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'earthGenasiFeatures.Natural Spells', '=', '"<i>Pass Without Trace</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1',
        'earthGenasiFeatures.Natural Spells', '=', '5'
      );
      rules.defineRule
        ('resistance.Earth', 'saveNotes.resistEarthFeature', '+=', null);
      rules.defineRule('saveNotes.resistEarthFeature',
        'level', '*', 'Math.floor((source + 4) / 5)'
      );
      rules.defineRule('validationNotes.earthGenasiRaceDomains',
        'race', '=', 'source == "Earth Genasi" ? -1 : null',
        'levels.Cleric', '?', null,
        'domains.Earth', '+', '1'
      );

    } else if(race == 'Fire Genasi') {
      adjustment = '+2 intelligence/-2 charisma';
      features = [
        'Darkvision', 'Level Adjustment', 'Natural Spells', 'Outsider',
        'Resist Fire'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'saveNotes.resistFireFeature:+%V vs. fire spells',
        'validationNotes.fireGenasiRaceDomains:Requires Fire'
      ];
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'fireGenasiFeatures.Level Adjustment', '=', '-1'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'fireGenasiFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'fireGenasiFeatures.Natural Spells', '=', '"<i>Control Flame</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1',
        'fireGenasiFeatures.Natural Spells', '=', '5'
      );
      rules.defineRule
        ('resistance.Fire', 'saveNotes.resistFireFeature', '+=', null);
      rules.defineRule('saveNotes.resistFireFeature',
        'level', '*', 'Math.floor((source + 4) / 5)'
      );
      rules.defineRule('validationNotes.fireGenasiRaceDomains',
        'race', '=', 'source == "Fire Genasi" ? -1 : null',
        'levels.Cleric', '?', null,
        'domains.Fire', '+', '1'
      );

    } else if(race == 'Water Genasi') {
      adjustment = '+2 constitution/-2 charisma';
      features = [
        'Darkvision', 'Level Adjustment', 'Natural Spells', 'Outsider',
        'Resist Water', 'Swim'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'abilityNotes.swimFeature:Swim speed %V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'saveNotes.resistWaterFeature:+%V vs. water spells',
        'validationNotes.waterGenasiRaceDomains:Requires Water'
      ];
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'waterGenasiFeatures.Level Adjustment', '=', '-1'
      );
      rules.defineRule('abilityNotes.swimFeature',
        'waterGenasiFeatures.Swim', '=', '30'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'waterGenasiFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'waterGenasiFeatures.Natural Spells', '=', '"<i>Create Water</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1',
        'waterGenasiFeatures.Natural Spells', '=', '5'
      );
      rules.defineRule
        ('resistance.Water', 'saveNotes.resistWaterFeature', '+=', null);
      rules.defineRule('saveNotes.resistWaterFeature',
        'level', '*', 'Math.floor((source + 4) / 5)'
      );
      rules.defineRule('validationNotes.waterGenasiRaceDomains',
        'race', '=', 'source == "Water Genasi" ? -1 : null',
        'levels.Cleric', '?', null,
        'domains.Water', '+', '1'
      );

    } else if(race == 'Tiefling') {
      adjustment = '+2 dexterity/+2 intelligence/-2 charisma';
      features = [
        'Darkvision', 'Level Adjustment', 'Natural Spells', 'Outsider', 'Sly',
        'Sneaky'
      ];
      notes = [
        'abilityNotes.levelAdjustmentFeature:%V',
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'magicNotes.naturalSpellsFeature:%V 1/day at level %1',
        'skillNotes.concealedFeature:+2 Hide',
        'skillNotes.slyFeature:+2 Bluff'
      ];
      // TODO cold, fire, electricty resistance 5
      rules.defineRule('abilityNotes.levelAdjustmentFeature',
        'tieflingFeatures.Level Adjustment', '=', '-1'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'tieflingFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('level',
        'abilityNotes.levelAdjustmentFeature', '+', null,
        '', '^', '1'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature',
        'tieflingFeatures.Natural Spells', '=', '"<i>Darkness</i>"'
      );
      rules.defineRule('magicNotes.naturalSpellsFeature.1', 'level', '=', null);

    } else
      continue;

    SRD35.defineRace(rules, race, adjustment, features);
    if(notes != null) {
      rules.defineNote(notes);
    }

  }

};
