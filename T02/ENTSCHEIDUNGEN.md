
1. Was tut dein Skript?
    In der Datei orte.json werden Orte mit ihren Koordinaten & der jährlichen Niederschlagsmenge in l/qm aufgelistet. Diese Daten werden in der projektion.js mit const orte aufgerufen & in richtige Zahlen umgewandelt. Mit der Funktion niederschlagZuFarbe wird ein Oklch-Farbbereich auf den vorkommenden Niederschlagsbereich gemappt. Dafür wird zuvor der min & max Niederschlag herausgefunden. Diese Farben werden dann verwendet & die Markierungen in der svg-Datei einzufärben.
2. Welche Stelle hättest du auch anders lösen können? Wie?
    Mit p5.js hätte man die JSON leichter über function preload aufrufen können.
3. Warum hast du es so gelöst?
    Die p5.js Bibliothek ist nicht eingebunden.
4. Was fiel dir schwer bei der Aufgabe?
    Ich wusste nicht mehr wie man Farben auf einen Bereich mappen kann (function niederschlagZuFarbe)
5. Was ist dir unklar geblieben?
    -