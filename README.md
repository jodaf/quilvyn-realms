## Forgotten Realms plugin for the Quilvyn RPG character sheet generator

The quilvyn-realms package bundles modules that extend Quilvyn to work with
the Forgotten Realms campaign setting, applying the rules of the
<a href="https://www.drivethrurpg.com/product/28729/Forgotten-Realms-Campaign-Setting-3e">3rd edition campaign setting rulebook</a>.

### Requirements

quilvyn-realms relies on the PHB35 module installed by the quilvyn-phb35
package and the core and srd35 modules installed by the quilvyn-core package.

### Installation

To use quilvyn-realms, unbundle the release package into the plugins/
subdirectory within the Quilvyn installation directory, then append the
following lines to the file plugins/plugins.js:

    RULESETS['Forgotten Realms Campaign Setting using D&D v3.5 rules'] = {
      url:'Realms.js',
      group:'v3.5',
      require:'D&D v3.5'
    };

### Usage

Once the quilvyn-realms package is installed as described above, start Quilvyn
and check the box next to "Forgotten Realms Campaign Setting using D&D v3.5
rules" from the rule sets menu in the initial window.
