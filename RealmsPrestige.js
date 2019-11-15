/*
Copyright 2019, James J. Hayes

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

"use strict";

/*
 * This module loads the prestige class rules from the Forgotten Realms
 * campaign setting.  The RealmsPrestige.CLASSES constant field can be
 * manipulated in order to trim the choices offered.
 */
function RealmsPrestige() {
  if(window.SRD35 == null || window.Realms == null) {
    alert
     ('The RealmsPrestige module requires use of the SRD35 and Realms modules');
    return;
  }
  RealmsPrestige.classRules(Realms.rules, RealmsPrestige.CLASSES);
}

RealmsPrestige.CLASSES = [
  // Identical to SRD: Archmage, Hierophant
  'Arcane Devotee', 'Divine Champion', 'Divine Disciple', 'Divine Seeker',
  'Guild Thief', 'Harper Scout', 'Hathran', 'Purple Dragon Knight',
  'Red Wizard', 'Runecaster', 'Shadow Adept'
];

/* Defines the rules related to character prestige classes. */
RealmsPrestige.classRules = function(rules, classes) {

  var schools = rules.getChoices('schools');

  for(var i = 0; i < classes.length; i++) {

    var baseAttack, feats, features, hitDie, notes, profArmor, profShield,
        profWeapon, saveFortitude, saveReflex, saveWill, selectableFeatures,
        skillPoints, skills, spellAbility, spells, spellsKnown, spellsPerDay;
    var klass = classes[i];

    if(klass == 'Arcane Devotee') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = [
        'Greater Spell Penetration', 'Improved Counterspell',
        'Magical Artisan', 'Shadow Weave Magic', 'Spell Penetration'
      ];
      for(var school in schools) {
        feats[feats.length] = 'Greater Spell Focus (' + school + ')';
        feats[feats.length] = 'Spell Focus (' + school + ')';
      }
      features = [
        '1:Caster Level Bonus', '1:Freely Enlarge Spell', '2:Alignment Focus',
        '2:Sacred Defense', '5:Divine Shroud'
      ];
      hitDie = 4;
      notes = [
        'magicNotes.alignmentFocusFeature:' +
          '+1 caster level on spells from chosen alignment component',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.freelyEnlargeSpellFeature:Cast enlarged spell %V/day',
        'saveNotes.divineShroudFeature:' +
          'Aura provides DC %V spell reistance for %1 rounds 1/day',
        'saveNotes.sacredDefenseFeature:+%V vs. divine spells',
        'validationNotes.arcaneDevoteeClassFeatures:Requires Enlarge Spell',
        'validationNotes.arcaneDevoteeClassSkills:' +
          'Requires Knowledge (Religion) >= 8/Spellcraft >= 8',
        'validationNotes.arcaneDevoteeClassSpells:Requires arcane level 4'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Concentration', 'Craft', 'Knowledge', 'Profession', 'Spellcraft'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('featCount.Arcane Devotee',
        'levels.Arcane Devotee', '+=', 'source >= 3 ? 1 : null'
      );
      rules.defineRule('magicNotes.casterLevelBonusFeature',
        'levels.Arcane Devotee', '+=', null
      );
      rules.defineRule('magicNotes.freelyEnlargeSpellFeature',
        'charismaModifier', '+=', 'source > 0 ? source + 1 : 1'
      );
      rules.defineRule('saveNotes.divineShroudFeature',
        'casterLevelArcane', '+=', '12 + source'
      );
      rules.defineRule('saveNotes.divineShroudFeature.1',
        'charismaModifier', '+=', '5 + source'
      );
      rules.defineRule('saveNotes.sacredDefenseFeature',
        'levels.Arcane Devotee', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('validationNotes.arcaneDevoteeClassSpells',
        'levels.Arcane Devotee', '=', '-1',
        /^spellsKnown\.(AS|B|S|W)4/, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Divine Champion') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Lay On Hands', '2:Sacred Defense', '3:Smite Infidel',
        '5:Divine Wrath'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.divineWrathFeature:' +
          '+3 attack/damage and DR 5/- for %V rounds 1/day',
        'combatNotes.smiteInfidelFeature:' +
          '+%V attack/+%1 damage vs. foe w/different deity 1/day',
        'magicNotes.layOnHandsFeature:Harm undead or heal %V HP/day',
        'saveNotes.divineWrathFeature:+3 saves %V rounds 1/day',
        'saveNotes.sacredDefenseFeature:+%V vs. divine spells',
        'validationNotes.divineChampionClassBaseAttack:' +
          'Requires Base Attack >= 7',
        'validationNotes.divineChampionClassFeats:' +
          'Requires Sum Weapon Focus >= 1',
        'validationNotes.divineChampionClassSkills:' +
          'Requires Knowledge (Religion) >= 3'
      ];
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_MEDIUM;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Climb', 'Craft', 'Handle Animal', 'Jump', 'Knowledge (Religion)',
        'Ride', 'Spot', 'Swim'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('combatNotes.divineWrathFeature', 'charismaModifier', '=', null);
      rules.defineRule('combatNotes.smiteInfidelFeature',
        'charismaModifier', '=', 'source > 0 ? source : 0'
      );
      rules.defineRule('combatNotes.smiteInfidelFeature.1',
        'levels.Divine Champion', '=', null
      );
      rules.defineRule('featCount.Fighter',
        'levels.Divine Champion', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.layOnHandsFeature',
        'levels.Divine Champion', '+=', null,
        'charismaModifier', '*', null,
        'charisma', '?', 'source >= 12'
      );
      rules.defineRule
        ('saveNotes.divineWrathFeature', 'charismaModifier', '=', null);
      rules.defineRule('saveNotes.sacredDefenseFeature',
        'levels.Divine Champion', '+=', 'Math.floor(source / 2)'
      );

    } else if(klass == 'Divine Disciple') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Caster Level Bonus', '1:Divine Emissary', '1:New Domain',
        '2:Sacred Defense', '3:Imbue With Spell Ability', '5:Native Outsider',
        '5:Transcendence'
      ];
      hitDie = 8;
      notes = [
        'featureNotes.divineEmissaryFeature:' +
          'Telepathy w/same-alignment outsider w/in 60 ft',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.imbueWithSpellAbilityFeature:' +
          '<i>Imbue With Spell Ability</i> 1st/2nd level spells at will',
        'magicNotes.transcendenceFeature:' +
          'Designated <i>Protection</i> spell at will',
        'saveNotes.nativeOutsiderFeature:' +
          'Affected by outsider target spells, not humanoid',
        'saveNotes.sacredDefenseFeature:+%V vs. divine spells',
        'skillNotes.transcendenceFeature:+2 charisma checks w/followers of %V',
        'validationNotes.divineDiscipleClassSkills:' +
          'Requires Diplomacy >= 5/Knowledge (Religion) >= 8',
        'validationNotes.divineDiscipleClassSpells:Requires divine level 4'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Concentration', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (Nature)', 'Knowledge (Religion)', 'Profession', 'Scry',
        'Spellcraft', 'Survival'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('domainCount', 'features.New Domain', '+', '1');
      rules.defineRule('magicNotes.casterLevelBonusFeature',
        'levels.Divine Disciple', '+=', null
      );
      rules.defineRule('saveNotes.sacredDefenseFeature',
        'levels.Divine Disciple', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('skillNotes.transcendenceFeature',
        'deity', '=', 'source.replace(/\\s*\\(.*\\)/, "")'
      );
      rules.defineRule('validationNotes.divineDiscipleClassSpells',
        'levels.Divine Disciple', '=', '-1',
        /^spellsKnown\.(C|D|P|R)4/, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Divine Seeker') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Sanctuary', '1:Thwart Glyph', '2:Sacred Defense', '2:Sneak Attack',
        '3:Locate Object', '3:Obscure Object', '5:Locate Creature',
        '5:Divine Perseverance'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.divinePerseveranceFeature:' +
          'Regain d8+5 HP from negative 1/day',
        'magicNotes.locateCreatureFeature:<i>Locate Creature</i> 1/day',
        'magicNotes.locateObjectFeature:<i>Locate Object</i> 1/day',
        'magicNotes.obscureObjectFeature:' +
          '<i>Obscure Object</i> to prevent tracking 1/day',
        'magicNotes.sanctuaryFeature:<i>Sanctuary</i> 1/day',
        'saveNotes.sacredDefenseFeature:+%V vs. divine spells',
        'skillNotes.thwartGlyphFeature:' +
          '+4 Disable Device (glyphs)/Search (glyphs)',
        'validationNotes.divineSeekerClassSkills:' +
          'Requires Hide >= 10/Knowledge (Religion) >= 3/Move Silently >= 8/' +
          'Spot >= 5'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 6;
      skills = [
        // Pick Pocket => Sleight Of Hand, Intuit Direction => ?
        'Bluff', 'Climb', 'Craft', 'Decipher Script', 'Diplomacy',
        'Disable Device', 'Jump', 'Knowledge (Religion)', 'Listen',
        'Move Silently', 'Open Lock', 'Profession', 'Search',
        'Sleight Of Hand', 'Tumble', 'Use Rope'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Divine Seeker', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('saveNotes.sacredDefenseFeature',
        'levels.Divine Seeker', '+=', 'Math.floor(source / 2)'
      );

    } else if(klass == 'Guild Thief') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = [
        'Alertness', 'Blind-Fight', 'Cosmopolitan', 'Education', 'Leadership',
        'Lightning Reflexes', 'Skill Focus', 'Still Spell', 'Street Smart',
        'Track', 'Weapon Finesse', 'Weapon Focus',
        'Weapon Proficiency (Hand Crossbow)'
      ];
      features = [
        '1:Sneak Attack', '1:Doublespeak', '2:Uncanny Dodge', '3:Reputation',
        '5:Improved Uncanny Dodge'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.improvedUncannyDodgeFeature:' +
          'Flanked only by rogue four levels higher',
        'combatNotes.sneakAttackFeature:' +
          '%Vd6 extra damage when surprising or flanking',
        'combatNotes.uncannyDodgeFeature:Always adds dexterity modifier to AC',
        'featureNotes.reputationFeature:+%V Leadership',
        'skillNotes.doublespeakFeature:+2 Bluff/Diplomacy',
        'validationNotes.guildThiefClassSkills:' +
          'Requires Gather Information >= 3/Hide >= 8/Intimidate >= 3/' +
          'Move Silently >= 3'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 6;
      skills = [
        // Innuendo => ?, Pick Pocket => Sleight Of Hand
        'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disable Device',
        'Forgery', 'Intimidate', 'Jump', 'Knowledge (Local)', 'Listen',
        'Move Silently', 'Open Lock', 'Profession', 'Search',
        'Sense Motive', 'Sleight Of Hand', 'Spot', 'Use Rope'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.sneakAttackFeature',
        'levels.Guild Thief', '+=', 'Math.floor((source + 1) / 2)'
      );
      rules.defineRule('featCount.Guild Thief',
        'levels.Guild Thief', '=', 'source < 2 ? null : Math.floor(source / 2)'
      );
      rules.defineRule('featureNotes.reputationFeature',
        'levels.Guild Thief', '=', 'source >= 3 ? source - 2 : null'
      );

    } else if(klass == 'Harper Scout') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Bardic Knowledge', '1:Favored Enemy', '2:Deneir\'s Eye',
        '2:Harper Skill Focus', '3:Tymora\'s Smile', '4:Lliira\'s Heart',
        '5:Craft Harper Item'
      ];
      hitDie = 6;
      notes = [
        'combatNotes.favoredEnemyFeature:' +
          '+2 or more damage vs. %V type(s) of creatures',
        'featureNotes.harperSkillFocusFeature:' +
          'Skill Focus in perform/chosen Harper class skill',
        'magicNotes.craftHarperItemFeature:' +
          'Create magic instruments/Harper pins/potions',
        'saveNotes.deneir\'sEyeFeature:+2 vs. glyphs',
        'saveNotes.lliira\'sHeartFeature:+2 vs. compulsion/fear',
        'saveNotes.tymora\'sSmileFeature:+2 luck bonus to any save 1/day',
        'skillNotes.favoredEnemyFeature:' +
          '+2 or more Bluff, Listen, Sense Motive, Spot, Survival ' +
          'vs. %V type(s) of creatures',
        'validationNotes.harperScoutSkillFocus:Requires Skill Focus (Perform)',
        'validationNotes.harperScoutClassAlignment:Requires Alignment !~ Evil',
        'validationNotes.harperScoutClassFeats:Requires Alertness/Iron Will',
        'validationNotes.harperScoutClassSkills:' +
          'Requires Bluff >= 4/Diplomacy >= 8/Knowledge (Local) >= 4/' +
          'Sum Perform >= 5/Sense Motive >= 2/Survival >= 2'
      ];
      profArmor = SRD35.PROFICIENCY_LIGHT;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_GOOD;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 4;
      skills = [
        // Intuit Direction => ?/Pick Pocket => Sleight Of Hand
        'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Disguise',
        'Escape Artist', 'Gather Information', 'Hide', 'Jump', 'Knowledge',
        'Listen', 'Move Silently', 'Perform', 'Profession', 'Sense Motive',
        'Speak Language', 'Swim', 'Tumble'
      ];
      spellAbility = 'charisma';
      spells = [
        'HS1:Change Self:Charm Person:Comprehend Languages:Erase:' +
        'Feather Fall:Jump:Light:Message:Mount:Read Magic:Scatterspray:' +
        'Sleep:Spider Climb',
        'HS2:Cat\'s Grace:Darkvision:Detect Thoughts:Eagle\'s Splendor:' +
        'Invisibility:Knock:Locate Object:Magic Mouth:Misdirection:' +
        'See Invisibility:Shadow Mask',
        'HS3:Clairaudience/Clairvoyance:Nondetection:Suggestion:Tongues:' +
        'Undetectable Alignment'
      ];
      spellsKnown = [
        'HS1:1:2/2:4',
        'HS2:3:2/4:4',
        'HS3:5:2'
      ];
      spellsPerDay = [
        'HS1:1:0/2:1',
        'HS2:3:0/4:1',
        'HS3:5:0'
      ];
      rules.defineRule
        ('classSkills.Bardic Knowledge', 'features.Bardic Knowledge', '=', '1');
      rules.defineRule('combatNotes.favoredEnemyFeature',
        'levels.Harper Scout', '+=', '1 + Math.floor(source / 4)'
      );
      rules.defineRule('featCount.General',
        'levels.Harper Scout', '+=', 'source >= 2 ? 2 : null'
      );
      rules.defineRule('validationNotes.harperScoutSkillFocus',
        'levels.Harper Scout', '=', 'source >= 2 ? 1 : null',
        /features.Skill Focus .Perform/, '+', '-1',
        '^', '', '0'
      );
      rules.defineRule('skillModifier.Bardic Knowledge',
        'skills.Bardic Knowledge', '=', null,
        'levels.Harper Scout', '+', null,
        'intelligenceModifier', '+', null
      );
      rules.defineRule('skillNotes.favoredEnemyFeature',
        'levels.Harper Scout', '+=', '1 + Math.floor(source / 4)'
      );
      rules.defineRule
        ('skills.Bardic Knowledge', 'features.Bardic Knowledge', '=', '0');

    } else if(klass == 'Hathran') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = null;
      features = [
        '1:Caster Level Bonus', '1:Cohort', '1:Place Magic',
        '1:Weapon Proficiency (Whip)', '3:Fear', '4:Circle Leader',
        '10:Greater Command'
      ];
      hitDie = 4;
      notes = [
        'featureNotes.cohortFeature:Gain Hathran or Barbarian follower',
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.circleLeaderFeature:' +
          '1 hour ritual w/2-5 other members raises caster level, ' +
          'gives metamagic feats',
        'magicNotes.fearFeature:<i>Fear</i> %V/day',
        'magicNotes.greaterCommandFeature:' +
          'Quickened <i>Greater Command</i> 1/day',
        'magicNotes.placeMagicFeature:' +
          'Cast spell w/out prepartion when in Rashemen',
        'validationNotes.hathranClassAlignment:' +
          'Requires Alignment =~ Lawful Good|Lawful Neutral|Neutral Good',
        'validationNotes.hathranClassDeity:' +
          'Requires Deity =~ Chauntea|Mielikki|Mystra',
        'validationNotes.hathranClassFeats:Requires Ethran',
        'validationNotes.hathranClassRace:Requires Race =~ Human',
        'validationNotes.hathranClassSpells:' +
          'Requires arcane level 2/divine level 2'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        // Animal Empathy => ?, Intuit Direction => ?, Scry => ?,
        // Wilderness Lore => Survival
        'Alchemy', 'Concentration', 'Craft', 'Knowledge', 'Perform',
        'Profession', 'Swim', 'Speak Language', 'Spellcraft', 'Survival'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('magicNotes.casterLevelBonusFeature', 'levels.Hathran', '+=', null);
      rules.defineRule('magicNotes.fearFeature',
        'levels.Hathran', '=', 'source >= 8 ? 3 : source >= 6 ? 2 : 1'
      );
      rules.defineRule('validationNotes.hathranClassSpells',
        'levels.Hathran', '=', '-11',
        /^spellsKnown\.(B|S|W)2/, '+', '10',
        /^spellsKnown\.(C|D|P|R)2/, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Purple Dragon Knight') {

      baseAttack = SRD35.ATTACK_BONUS_GOOD;
      feats = null;
      features = [
        '1:Heroic Shield', '1:Rallying Cry', '2:Knight\'s Courage',
        '3:Knight\'s Fear', '4:Oath Of Wrath', '5:Final Stand'
      ];
      hitDie = 10;
      notes = [
        'combatNotes.finalStandFeature:' +
          '%V allies w/in 10 ft gain 2d10 HP for %1 rounds 1/day',
        'combatNotes.heroicShieldFeature:Aid Another action gives +4 AC bonus',
        'combatNotes.oathOfWrathFeature:' +
          '+2 attack/damage vs. chosen opponent 1/day',
        'combatNotes.rallyingCryFeature:' +
          'Allies w/in 60 ft +1 next attack/+5 speed for 1 turn 3/day',
        'magicNotes.knight\'sCourageFeature:' +
          'Allies +1 attack/damage, +2 charm/fear saves during speech +5 ' +
          'rounds %V/day',
        'magicNotes.knight\'sFearFeature:DC %V <i>Fear</i> at will',
        'saveNotes.oathOfWrathFeature:+2 save vs. chosen opponent 1/day',
        'skillNotes.oathOfWrathFeature:+2 checks vs. chosen opponent 1/day',
        'validationNotes.purpleDragonKnightClassAlignment:' +
          'Alignment !~ Chaotic|Evil',
        'validationNotes.purpleDragonKnightClassBaseAttack:' +
          'Requires Base Attack >= 4',
        'validationNotes.purpleDragonKnightClassFeats:' +
          'Requires Leadership/Mounted Combat',
        'validationNotes.purpleDragonKnightClassSkills:' +
          'Requires Diplomacy >= 1||Intimidate >= 1/Listen >= 2/Ride >= 2/' +
          'Spot >= 2'
      ];
      profArmor = SRD35.PROFICIENCY_MEDIUM;
      profShield = SRD35.PROFICIENCY_HEAVY;
      profWeapon = SRD35.PROFICIENCY_LIGHT;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_POOR;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Climb', 'Diplomacy', 'Intimidate', 'Jump', 'Ride', 'Swim'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('combatNotes.finalStandFeature',
        'levels.Purple Dragon Knight', '=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule('combatNotes.finalStandFeature.1',
        'levels.Purple Dragon Knight', '=', null,
        'charismaModifier', '+', null
      );
      rules.defineRule('magicNotes.knight\'sCourageFeature',
        'levels.Purple Dragon Knight', '=', 'Math.floor(source / 2)'
      );
      rules.defineRule('magicNotes.knight\'sFearFeature',
        'charismaModifier', '=', '13 + source'
      );

    } else if(klass == 'Red Wizard') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = null;
      features = [
        '1:Caster Level Bonus', '1:Enhanced Specialization',
        '1:Specialist Defense', '2:Spell Power', '5:Circle Leader',
        '7:Scribe Tattoo', '10:Great Circle Leader'
      ];
      hitDie = 4;
      notes = [
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.enhancedSpecializationFeature:Additional prohibited school',
        'magicNotes.circleLeaderFeature:' +
          '1 hour ritual w/2-5 other members raises caster level, ' +
          'gives metamagic feats',
        'magicNotes.greatCircleLeaderFeature:' +
          'Lead magic circle w/9 other members',
        'magicNotes.scribeTattooFeature:Induct novices into circle',
        'magicNotes.spellPowerFeature:+%V specific spell DC/resistance checks',
        'magicNotes.tattooFocusFeature:' +
          '+1 DC/+1 caster level vs. resistance w/specialization school spells',
        'saveNotes.specialistDefenseFeature:' +
          '+%V bonus on saves vs. specialist school spells',
        'validationNotes.redWizardClassAlignment:Requires Alignment !~ Good',
        'validationNotes.redWizardClassFeats:' +
          'Requires Tattoo Focus/any 3 metamagic or item creation',
        'validationNotes.redWizardClassRace:Requires Race == "Human"',
        'validationNotes.redWizardClassSkills:Requires Spellcraft >= 8',
        'validationNotes.redWizardClassSpells:Requires arcane level 3',
        'validationNotes.tattooFocusMagic:Requires magic school specialization'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        'Bluff', 'Concentration', 'Craft', 'Intimidate', 'Knowledge',
        'Profession', 'Spellcraft'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineChoice('feats', 'Tattoo Focus:General');
      rules.defineRule
        ('featCount.Wizard', 'levels.Red Wizard', '+=', 'source>=5 ? 1 : null');
      rules.defineRule
        ('features.Tattoo Focus', 'feats.Tattoo Focus', '=', null);
      rules.defineRule
        ('magicNotes.casterLevelBonusFeature', 'levels.Red Wizard', '+=', null);
      rules.defineRule('saveNotes.specialistDefenseFeature',
        'levels.Red Wizard', '+=',
        'Math.floor((source + 1) / 2) - (source >= 5 ? 1 : 0)'
      );
      rules.defineRule('magicNotes.spellPowerFeature',
        'levels.Red Wizard', '+=', 'Math.floor(source / 2)'
      );
      rules.defineRule('validationNotes.redWizardClassFeats',
        'levels.Red Wizard', '=', '-13',
        'features.Tattoo Focus', '+', '10',
        'features.Spell Mastery', '+', '1',
        /^features\.(Brew|Craft|Forge|Scribe)/, '+', '1',
        // NOTE: False valid w/Natural Spell
        /^features\..*Spell$/, '+', '1',
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.redWizardClassSpells',
        'levels.Red Wizard', '=', '-1',
        /^spellsKnown\.(AS|B|W)3/, '+', '1',
        '', 'v', '0'
      );
      rules.defineRule('validationNotes.tattooFocusMagic',
        'feats.Tattoo Focus', '=', '-1',
        /^specialize\./, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Runecaster') {

      baseAttack = SRD35.ATTACK_BONUS_AVERAGE;
      feats = null;
      features = [
        '1:Caster Level Bonus', '1:Rune Craft', '2:Rune Power',
        '3:Improved Runecasting', '6:Maximize Rune', '10:Rune Chant'
      ];
      hitDie = 8;
      notes = [
        'magicNotes.casterLevelBonusFeature:' +
          '+%V base class level for spells known/per day',
        'magicNotes.improvedRunecastingFeature:Add charges/triggers to runes',
        'magicNotes.runeChantFeature:+3 DC divine spells when tracing rune',
        'magicNotes.maximizeRuneFeature:+5 DC/maximize effects of runes',
        'magicNotes.runePowerFeature:+%V DC of runes',
        'skillNotes.runeCraftFeature:+%V Craft (inscribing runes)',
        'validationNotes.runecasterClassFeats:Requires Inscribe Rune',
        'validationNotes.runecasterClassSkills:' +
          'Requires Sum Craft >= 8/Spellcraft >= 8',
        'validationNotes.runecasterClassSpells:Requires divine level 3'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_GOOD;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        // Scry => ?
        'Concentration', 'Craft', 'Diplomacy', 'Heal', 'Knowledge (Arcana)',
        'Knowledge (Religion)', 'Profession', 'Spellcraft'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule
        ('magicNotes.casterLevelBonusFeature', 'levels.Runecaster', '+=', null);
      rules.defineRule('magicNotes.runePowerFeature',
        'levels.Runecaster', '=', 'source >= 9 ? 3 : source >= 5 ? 2 : 1'
      );
      rules.defineRule('skillNotes.runeCraftFeature',
        'levels.Runecaster', '=', 'source>=7 ? 3 : Math.floor((source + 2) / 3)'
      );
      rules.defineRule('validationNotes.runecasterClassSpells',
        'levels.Runecaster', '=', '-1',
        /^spellsKnown\.(C|D|P|R)3/, '+', '1',
        '', 'v', '0'
      );

    } else if(klass == 'Shadow Adept') {

      baseAttack = SRD35.ATTACK_BONUS_POOR;
      feats = null;
      features = [
        '1:Insidious Magic', '1:Pernicious Magic', '1:Tenacious Magic',
        '2:Low-Light Vision', '2:Shadow Defense', '3:Spell Power',
        '4:Shield Of Shadows', '7:Darkvision', '7:Shadow Walk',
        '8:Greater Shield Of Shadows', '10:Shadow Double'
      ];
      hitDie = 4;
      notes = [
        'featureNotes.darkvisionFeature:%V ft b/w vision in darkness',
        'featureNotes.low-LightVisionFeature:x%V normal distance in poor light',
        'magicNotes.insidiousMagicFeature:' +
          'DC 9+foe level check to detect Weave magic/Foe DC %V check to ' +
          'detect Shadow Weave spell',
        'magicNotes.perniciousMagicFeature:' +
          'Weave foes DC %V check to counterspell/DC 9+foe level to ' +
          'counterspell Weave foes',
        'magicNotes.shadowWalkFeature:<i>Shadow Walk</i> 1/day',
        'magicNotes.shieldOfShadowsFeature:' +
          '<i>Shield</i> w/30% concealment %V rounds/day',
        'magicNotes.shadowDoubleFeature:Create clone lasting %V rounds 1/day',
        'magicNotes.spellPowerFeature:+%V specific spell DC/resistance checks',
        'magicNotes.tenaciousMagicFeature:' +
          'Weave foes DC %V check to dispel/DC 13+foe level to ' +
          'dispel Weave foes',
        'saveNotes.greaterShieldOfShadowsFeature:' +
          'Shield Of Shadows gives %V spell resistance',
        'saveNotes.shadowDefenseFeature:' +
          '+%V vs. Enchantment/Illusion/Necromancy/Darkness spells',
        'validationNotes.shadowAdeptClassFeats:' +
          'Requires Shadow Weave Magic/any Metamagic',
        'validationNotes.shadowAdeptClassAlignment:Requires Alignment !~ Good',
        'validationNotes.shadowAdeptClassSkills:' +
          'Requires Knowledge (Arcana) >= 8/Spellcraft >= 8',
        'validationNotes.shadowAdeptClassSpells:Requires level 3'
      ];
      profArmor = SRD35.PROFICIENCY_NONE;
      profShield = SRD35.PROFICIENCY_NONE;
      profWeapon = SRD35.PROFICIENCY_NONE;
      saveFortitude = SRD35.SAVE_BONUS_POOR;
      saveReflex = SRD35.SAVE_BONUS_POOR;
      saveWill = SRD35.SAVE_BONUS_GOOD;
      selectableFeatures = null;
      skillPoints = 2;
      skills = [
        // Scry => ?
        'Bluff', 'Concentration', 'Craft', 'Disguise', 'Hide', 'Knowledge',
        'Profession', 'Spellcraft'
      ];
      spellAbility = null;
      spells = null;
      spellsKnown = null;
      spellsPerDay = null;
      rules.defineRule('featCount.Metamagic',
        'levels.Shadow Adept', '+=', 'source >= 5 ? 1 : null'
      );
      rules.defineRule('featureNotes.darkvisionFeature',
        'shadowAdeptFeatures.Darkvision', '+=', '60'
      );
      rules.defineRule('featureNotes.low-LightVisionFeature',
        '', '=', '1',
        'shadowAdeptFeatures.Low-Light Vision', '+', null
      );
      rules.defineRule
        ('magicNotes.insidiousMagicFeature', 'casterLevel', '=', 'source + 11');
      rules.defineRule('magicNotes.perniciousMagicFeature',
        'casterLevel', '=', 'source + 11'
      );
      rules.defineRule
        ('magicNotes.shieldOfShadowsFeature', 'casterLevel', '=', null);
      rules.defineRule
        ('magicNotes.shadowDoubleFeature', 'casterLevel', '=', null);
      rules.defineRule('magicNotes.spellPowerFeature',
        'levels.Shadow Adept', '+=', 'Math.floor(source / 3)'
      );
      rules.defineRule
        ('magicNotes.tenaciousMagicFeature', 'casterLevel', '=', '15 + source');
      rules.defineRule('saveNotes.greaterShieldOfShadowsFeature',
        'levels.Shadow Adept', '=', 'source + 12'
      );
      rules.defineRule('saveNotes.shadowDefenseFeature',
        'levels.Shadow Adept', '=', 'Math.floor((source + 1) / 3)'
      );
      rules.defineRule('validationNotes.shadowAdeptClassSpells',
        'levels.Shadow Adept', '=', '-1',
        /^spellsKnown\..*3/, '+', '1',
        '', 'v', '0'
      );

    } else
      continue;

    SRD35.defineClass
      (rules, klass, hitDie, skillPoints, baseAttack, saveFortitude, saveReflex,
       saveWill, profArmor, profShield, profWeapon, skills, features,
       spellsKnown, spellsPerDay, spellAbility);
    if(notes != null)
      rules.defineNote(notes);
    if(feats != null) {
      for(var j = 0; j < feats.length; j++) {
        rules.defineChoice('feats', feats[j] + ':' + klass);
      }
    } 
    if(selectableFeatures != null) {
      for(var j = 0; j < selectableFeatures.length; j++) {
        var selectable = selectableFeatures[j];
        var choice = klass + ' - ' + selectable;
        rules.defineChoice('selectableFeatures', choice + ':' + klass);
        rules.defineRule(klass + 'Features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
        rules.defineRule('features.' + selectable,
          'selectableFeatures.' + choice, '+=', null
        );
      }
    }
    if(spells != null) {
      for(var j = 0; j < spells.length; j++) {
        var pieces = spells[j].split(':');
        for(var k = 1; k < pieces.length; k++) {
          var spell = pieces[k];
          var school = SRD35.spellsSchools[spell];
          if(school == null) {
            continue;
          }
          spell += '(' + pieces[0] + ' ' +
                    (school == 'Universal' ? 'Univ' : schools[school]) + ')';
          rules.defineChoice('spells', spell);
        }
      }
    }

  }

};
