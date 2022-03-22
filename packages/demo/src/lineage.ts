import { makeTree } from "./make-tree";

const gotLineage = `House Arryn
 Jon
  Robin
House Tully
 Hoster
  Lysa
  Edmure
  Catelyn
House Stark
 Rickard
  Brandon
  Eddard
   Robb
   Sansa
   Arya
   Brandon
   Rickon
  Benjen
  Lyanna
House Targaryen
 Aerys II (the Mad)
  Rhaegar
   Jon Snow
  Viserys
  Daenerys
House Baratheon
 Steffon
  Robert
  Stannis
   Shireen
  Renly
House Lanister
 Tywin
  Jaime
  Cersei
   Joffery
   Myrcella
   Tommen
  Tyrion
House Tyrell
 Olenna
  Mace
   Margaery
   Loras
House Martell
 Doran
  Trystane
 Elia
 Oberyn
  Sand Snakes`;

export default makeTree(gotLineage, true);
