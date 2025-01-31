import Attack from "./core/Attack";
import Character from "./core/Character";
import Damage from "./core/Damage";
import Enemy from "./core/Enemy";

// Création d'une attaque (50 de puissance, multiplicateur 1.5)
const attack = new Attack(50, 1.5);

// Création d'un personnage avec cette attaque
const hero = new Character("Héros", attack);

// Création d'un ennemi avec 200 de vie
const enemy = new Enemy("Dragon", 200);

// Le héros effectue l'attaque et les dégâts sont calculés
const heroDamage = hero.performAttack(); // Appelle la méthode pour attaquer

// Calcul des dégâts à l'aide de la classe Damage
const damageCalculator = new Damage(attack);
const calculatedDamage = damageCalculator.calculate();  // Calcule les dégâts via Damage

// Affichage des dégâts dans la console
console.log(`${hero.name} inflige ${heroDamage} points de dégâts.`);

// L'ennemi subit les dégâts
enemy.takeDamage(calculatedDamage);  // L'ennemi prend les dégâts calculés

// Vérification de la vie restante de l'ennemi
console.log(`${enemy.name} a maintenant ${enemy.health} points de vie restants.`);
