## Forgotten Realms plugin for the Quilvyn RPG character sheet generator

The quilvyn-eberron package bundles modules that extend Quilvyn to work with
the Forgotten Realms campaign setting, applying the rules of the
<a href="https://www.drivethrurpg.com/product/28729/Forgotten-Realms-Campaign-Setting-3e">3rd edition campaign setting rulebook</a>.

### Requirements

quilvyn-realms relies on the core and srd35 modules installed by the
quilvyn-core package.

### Installation

To use quilvyn-realms, unbundle the release package into a plugins/
subdirectory within the Quilvyn installation directory, then add or uncomment
the 'plugins/Realms.js' entry in the PLUGINS definition in quilvyn.html. An
entry for 'plugins/RealmsPrestige.js' can also be added or uncommented to use
the prestige classes from the campaign setting rulebook. 

### Usage

Once the Forgotten Realms plugin is installed as described above, start Quilvyn
and choose Forgotten Realms from the Rules menu in the editor window.
