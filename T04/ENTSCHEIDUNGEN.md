
Hausaufgabe T04

1. Wie funktionieren Ausschnitt und Zoom?
    Der SVG-Rahmen behält immer die Größe von 720 x 360 px. Der Kartenausschnitt bestimmt, welcher Ort gezeigt werden soll und mit demZoomfaktor kann man dann beeinflussen, wie groß der entsprechende Ort dargestellt werden soll. Die Konstante AUSSCHNITT bestimmt die Basisansicht der Karte. Aus der Konstante zoom ergibt sich der Zoom-Faktor, indem durch die Slider-Breite geteilt wird. 
    Mit dem Zoom-Ausschnitt wird dann die relative Lage des Zoompunkts (Schwäbisch-Gmünd) im Basisausschnitt berechnet & der Ausschnitt wird so verschoben, dass der Zoompunkt immer an der gleichen Stelle stehen bleibt.
    Orte, die durch den gezoomten Ausschnitt außerhalb des SVG-Rahmens liegen, werden beim Zeichnen mit continue übersprungen.

2. Welche Stolpersteine gab es bei der Umsetzung?
    Mir war anfangs selbst nicht wirklich klar, wass den Ausschnitt vom Zoom unterscheidet. Deshalb war es schwer einen guten Prompt zu bauen, wenn man das Thema selbst noch nicht ganz begriffen hat. Mit der Umsetzung wurde es mir dann etwas klarer.
3. Was ist dir unklar geblieben?

    Ich habe noch nicht verstanden, was in der README.md stehen muss.
    Die Karte wird gerade noch verzerrt. Mir ist nicht ganz klar, wie man das mit einem Ausschnitt bestehend aus 4 festen Werten umgeht.