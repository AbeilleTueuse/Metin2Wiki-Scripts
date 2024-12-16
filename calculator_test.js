  function referenceCalculation(attacker, victim, attackType, battle) {
    var weaponData = {0: ['Poings', 8, [0, 0, 0, 0], [0]], 10: ['Épée', 0, [15, 19, 13, 15], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 20: ['Épée longue', 0, [13, 15, 15, 19], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 30: ['Lame courbe', 0, [20, 24, 20, 24], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 40: ['Canne Épée', 0, [25, 35, 22, 26], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 50: ['Épée large', 0, [20, 28, 25, 35], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 60: ['Épée en argent', 0, [38, 52, 36, 46], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 70: ['Épée aux orchidées', 0, [36, 46, 38, 52], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 80: ['Épée bâtarde', 0, [52, 68, 48, 58], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 90: ['Glaive barbare', 0, [48, 58, 52, 68], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 100: ['Épée sanglante', 0, [69, 91, 65, 87], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 110: ['Grande Épée', 0, [65, 87, 69, 91], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 120: ['Épée du magic. volant', 0, [72, 108, 74, 100], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 130: ['Épée de demi-lune', 0, [74, 100, 72, 108], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 140: ['Épée de bataille', 0, [65, 87, 100, 140], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 150: ['Lame de croc fantôme', 7, [90, 110, 77, 105], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 160: ['Épée de nymphe', 0, [69, 81, 102, 138], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 170: ['Épée de piqûre', 0, [69, 81, 102, 138], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 180: ['Épée empoisonnée', 0, [0, 0, 100, 140], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 190: ['Épée du lion', 7, [77, 105, 90, 110], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 200: ['Lame tranchante', 7, [68, 90, 92, 135], [100, 111, 170, 170, 170, 180, 190, 190, 200, 210]], 240: ["Épée d'exorcisme", 7, [74, 98, 98, 142], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 250: ['Lame démoniaque', 7, [90, 110, 77, 105], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 270: ['Épée de Triton', 0, [18, 40, 100, 140], [137, 138, 140, 144, 149, 155, 162, 170, 180, 190]], 280: ['Épée sacrée', 7, [90, 110, 5, 70], [140, 132, 142, 150, 150, 160, 170, 180, 190, 200]], 290: ['Épée de la lune pleine', 0, [62, 88, 57, 73], [0, 6, 11, 17, 22, 30, 38, 48, 58, 70]], 300: ['Lame du zodiaque', 7, [149, 211, 116, 164], [0, 10, 14, 22, 33, 50, 74, 111, 167, 250]], 310: ['Épée du zodiaque', 0, [0, 0, 149, 211], [0, 8, 11, 17, 26, 40, 59, 88, 133, 200]], 320: ['Épée du dragon obscur', 0, [0, 0, 135, 214], [0, 13, 17, 24, 34, 45, 70, 112, 137, 209, 224, 239, 254, 269, 284, 314]], 340: ['Stylet du dragon obs.', 7, [136, 217, 111, 162], [0, 15, 20, 33, 42, 64, 92, 111, 169, 234, 270, 285, 300, 315, 340, 370]], 360: ['Épée serpent', 0, [0, 0, 175, 193], [0, 15, 25, 35, 46, 60, 92, 147, 179, 273, 293, 313, 335, 355, 375, 413]], 380: ['Lame serpent', 7, [177, 300, 144, 230], [0, 22, 28, 45, 57, 86, 122, 147, 222, 306, 353, 373, 393, 412, 444, 485]], 460: ['Épée runique', 0, [119, 161, 153, 207], [0, 10, 14, 22, 33, 50, 74, 111, 167, 250]], 470: ['Lame dent de dragon', 7, [149, 211, 116, 164], [0, 10, 14, 22, 33, 50, 74, 111, 167, 250]], 500: ['Épée de kyanite', 7, [149, 211, 87, 137], [140, 160, 170, 170, 180, 190, 210, 230, 240, 250]], 1000: ['Dague', 1, [0, 0, 8, 11], [0, 4, 8, 12, 16, 20, 24, 28, 32, 36]], 1010: ['Dague cobra', 1, [0, 0, 13, 15], [0, 4, 8, 12, 16, 20, 24, 28, 32, 36]], 1020: ['Dagues ciseaux', 1, [0, 0, 15, 19], [0, 4, 8, 12, 16, 20, 24, 28, 32, 36]], 1030: ['Couteau porte-bonheur', 1, [0, 0, 30, 36], [0, 3, 6, 9, 12, 17, 23, 30, 38, 47]], 1040: ['Cout. Morsure de Chat', 1, [0, 0, 33, 37], [0, 3, 6, 9, 12, 17, 23, 30, 38, 47]], 1050: ['Poig. Visage de Diable', 1, [0, 0, 36, 40], [0, 3, 6, 9, 12, 17, 23, 30, 38, 47]], 1060: ['Dague du poing diab.', 1, [0, 0, 47, 51], [0, 2, 4, 6, 8, 12, 17, 23, 30, 38]], 1070: ['Dague sanglante', 1, [0, 0, 48, 56], [0, 2, 4, 6, 8, 12, 17, 23, 30, 38]], 1080: ['Couteau de Nervure', 1, [0, 0, 49, 59], [0, 2, 4, 6, 8, 12, 17, 23, 30, 38]], 1090: ['Chakram', 1, [0, 0, 53, 65], [0, 2, 4, 6, 8, 12, 17, 23, 30, 38]], 1100: ['Couteau du dragon', 1, [0, 0, 74, 86], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 1110: ["Couteau d'éclairs", 1, [0, 0, 74, 86], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 1120: ['Couteau siamois', 1, [0, 0, 74, 86], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 1130: ['Chakram aile du diable', 1, [0, 0, 83, 92], [0, 8, 17, 27, 38, 50, 63, 77, 101, 137]], 1170: ['Dague de feuille noire', 1, [0, 0, 40, 44], [0, 3, 5, 8, 10, 15, 20, 27, 34, 43]], 1180: ['Dague du zodiaque', 1, [0, 0, 116, 136], [0, 12, 17, 27, 41, 63, 93, 139, 210, 315]], 1190: ['Dague du dragon obsc.', 1, [0, 0, 112, 139], [0, 16, 21, 31, 45, 67, 97, 143, 204, 305, 340, 355, 370, 385, 400, 430]], 1210: ['Dague serpent', 1, [0, 0, 145, 198], [0, 24, 32, 45, 62, 89, 129, 188, 270, 400, 445, 465, 485, 505, 525, 562]], 1340: ['Lame des cinq éléments', 1, [0, 0, 116, 136], [0, 12, 17, 27, 41, 63, 93, 139, 210, 315]], 1500: ['Dague de kyanite', 1, [0, 0, 87, 109], [140, 160, 170, 170, 180, 190, 210, 230, 240, 250]], 2000: ['Arc court', 2, [0, 0, 7, 29], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 2010: ['Arc long', 2, [0, 0, 15, 51], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 2020: ['Arc composite', 2, [0, 0, 19, 57], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 2030: ['Arc de bataille', 2, [0, 0, 26, 70], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 2040: ['Arc long de cavalerie', 2, [0, 0, 40, 88], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 2050: ['Arc de bat. cavalerie', 2, [0, 0, 50, 118], [0, 7, 14, 21, 28, 37, 47, 58, 70, 83]], 2060: ['Arc cuivré', 2, [0, 0, 62, 128], [0, 7, 14, 21, 28, 37, 47, 58, 70, 83]], 2070: ['Arc de ruine noire', 2, [0, 0, 64, 150], [0, 7, 14, 21, 28, 37, 47, 58, 70, 83]], 2080: ["Arc d'oeil rouge", 2, [0, 0, 65, 194], [0, 7, 14, 21, 28, 37, 47, 58, 70, 83]], 2090: ['Arc de feuilles épin.', 2, [0, 0, 106, 206], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 2100: ['Arc cornes de taureau', 2, [0, 0, 116, 216], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 2110: ['Arc de licorne', 2, [0, 0, 139, 213], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 2120: ["Arc d'aile géante", 2, [0, 0, 135, 251], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 2130: ["Arc d'abricot divin", 2, [0, 0, 190, 290], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 2140: ['Arc géant drag. jaune', 2, [0, 0, 187, 293], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 2150: ['Arc à cornes', 2, [0, 0, 85, 178], [0, 7, 13, 20, 26, 35, 44, 55, 66, 79]], 2160: ['Arc diabolique géant', 2, [0, 0, 187, 293], [138, 143, 149, 156, 164, 173, 183, 194, 206, 223]], 2170: ["Arc de corbeau d'acier", 2, [0, 0, 190, 290], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 2180: ['Arc du dragon bleu', 2, [0, 0, 187, 293], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 2200: ['Arc du zodiaque', 2, [0, 0, 237, 436], [0, 10, 14, 22, 33, 50, 74, 111, 167, 250]], 2210: ['Arc du dragon obscur', 2, [0, 0, 233, 439], [0, 13, 17, 25, 36, 53, 77, 114, 160, 243, 268, 283, 298, 313, 328, 358]], 2230: ['Arc serpent', 2, [0, 0, 303, 594], [0, 19, 25, 35, 49, 71, 103, 152, 211, 318, 351, 370, 390, 410, 430, 468]], 2370: ['Arc du phénix', 2, [0, 0, 237, 436], [0, 10, 14, 22, 33, 50, 74, 111, 167, 250]], 2500: ['Arc de kyanite', 2, [0, 0, 208, 409], [140, 160, 170, 170, 180, 190, 210, 230, 240, 250]], 3000: ['Glaive', 3, [0, 0, 14, 22], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 3010: ['Lance', 3, [0, 0, 23, 33], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 3020: ['Lame guillotine', 3, [0, 0, 24, 42], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 3030: ['Lance araignée', 3, [0, 0, 30, 44], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 3040: ['Gisarme', 3, [0, 0, 34, 52], [0, 8, 16, 24, 32, 40, 48, 56, 64, 72]], 3050: ['Faux de guerre', 3, [0, 0, 52, 86], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 3060: ['Fourche Militaire', 3, [0, 0, 58, 88], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 3070: ['Hallebarde', 3, [0, 0, 60, 96], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 3080: ['Grand hache', 3, [0, 0, 69, 103], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 3090: ['Pique de glace', 3, [0, 0, 84, 122], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 3100: ['Épée des douze Esprits', 3, [0, 0, 85, 139], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 3110: ['Lame du salut', 3, [0, 0, 86, 154], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 3120: ['Tueuse de lion', 3, [0, 0, 102, 156], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 3130: ['Partisan', 3, [0, 0, 136, 184], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 3140: ['Lame électromagnétique', 3, [0, 0, 126, 194], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 3150: ["Lame voleuse d'âme", 3, [0, 0, 126, 194], [0, 6, 13, 27, 38, 50, 63, 77, 102, 137]], 3160: ['Épée de rancune', 3, [0, 0, 136, 184], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 3190: ['Lame solaire', 3, [0, 0, 230, 311], [0, 7, 10, 16, 24, 37, 55, 83, 125, 187]], 3210: ['Lame de fer rouge', 3, [0, 0, 72, 109], [0, 6, 11, 17, 22, 30, 38, 48, 58, 70]], 3220: ['Glaive du zodiaque', 3, [0, 0, 230, 311], [0, 7, 10, 16, 24, 37, 55, 83, 125, 187]], 3230: ['Lame du dragon obscur', 3, [0, 0, 226, 314], [0, 10, 13, 19, 27, 40, 58, 86, 118, 180, 210, 225, 240, 255, 270, 300]], 3250: ['Grande épée serpent', 3, [0, 0, 293, 429], [0, 13, 23, 26, 43, 55, 85, 115, 155, 220, 280, 300, 320, 340, 365, 405]], 3500: ['Lame de kyanite', 3, [0, 0, 201, 284], [140, 160, 170, 170, 180, 190, 210, 230, 240, 250]], 4000: ['Amija', 1, [0, 0, 12, 14], [0, 4, 8, 12, 16, 20, 24, 28, 32, 36]], 4010: ['Neuf Lames', 1, [0, 0, 14, 16], [0, 4, 8, 12, 16, 20, 24, 28, 32, 36]], 4020: ['Couteau court', 1, [0, 0, 28, 32], [0, 3, 6, 9, 12, 17, 23, 30, 38, 47]], 4040: ['Couteau sans âme', 1, [0, 0, 74, 84], [151, 153, 155, 158, 161, 165, 171, 179, 189, 201]], 5000: ['Gong de cuivre', 4, [10, 18, 13, 15], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 5010: ["Gong d'argent", 4, [4, 30, 20, 26], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 5020: ["Gong d'or", 4, [19, 27, 25, 35], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 5030: ['Gong de jade', 4, [30, 38, 29, 39], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 5040: ['Gong de fontaine', 4, [26, 52, 41, 51], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 5050: ['Gong abricot', 4, [42, 48, 42, 60], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 5060: ['Gong magique', 4, [43, 67, 59, 89], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 5070: ["Gong d'insecte d'or", 4, [47, 77, 68, 90], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 5080: ["Gong d'insecte d'acier", 4, [65, 75, 76, 104], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 5090: ['Gong oiseau tonnerre', 4, [47, 77, 91, 129], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 5100: ['Gong terre et ciel', 4, [65, 75, 72, 108], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 5110: ['Gong antique', 4, [35, 60, 50, 70], [0, 6, 11, 17, 22, 30, 38, 48, 58, 70]], 5120: ['Gong de bambou', 4, [70, 80, 72, 108], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 5160: ['Cloche du zodiaque', 4, [84, 116, 166, 194], [0, 9, 12, 19, 29, 45, 66, 99, 150, 225]], 5170: ['Gong du dragon obscur', 4, [81, 120, 162, 197], [0, 9, 12, 19, 29, 45, 66, 99, 130, 219, 242, 255, 269, 283, 298, 335]], 5200: ['Cloche serpent', 4, [105, 172, 211, 273], [0, 15, 19, 28, 39, 61, 89, 132, 172, 288, 318, 335, 353, 373, 390, 438]], 5330: ['Gong Gueule de Dragon', 4, [60, 70, 70, 100], [100, 110, 110, 120, 130, 140, 150, 160, 170, 180]], 5340: ["Cloche d'esprit dragon", 4, [84, 116, 166, 194], [0, 9, 12, 19, 29, 45, 66, 99, 150, 225]], 5500: ['Gong de kyanite', 4, [84, 116, 137, 167], [140, 160, 170, 170, 180, 190, 210, 230, 240, 250]], 6000: ["Flambeau d'acier", 5, [15, 19, 13, 15], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 6010: ['Lance de phoenix', 5, [0, 0, 40, 44], [0, 3, 5, 8, 10, 15, 20, 27, 34, 43]], 6020: ['Griffe de fer', 5, [0, 0, 57, 73], [0, 3, 5, 8, 10, 15, 20, 27, 34, 43]], 6030: ["Griffe d'acier", 5, [0, 0, 69, 91], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 6040: ['Griffe prédatrice', 5, [0, 0, 72, 108], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 6050: ['Griffe de scarabée', 5, [0, 0, 74, 100], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 6060: ['Griffe de faucon', 5, [0, 0, 80, 112], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 6070: ['Griffe épineuse', 5, [0, 0, 81, 110], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 6080: ['Croc de loup vert', 5, [0, 0, 92, 145], [100, 111, 170, 170, 170, 180, 190, 190, 200, 210]], 6090: ['Seigneur des dragons', 5, [0, 0, 122, 165], [0, 10, 14, 22, 33, 50, 74, 111, 167, 250]], 6120: ['Griffe du zodiaque', 5, [0, 0, 122, 165], [0, 10, 14, 22, 33, 50, 74, 111, 167, 250]], 6130: ['Griffe du dragon obs.', 5, [0, 0, 115, 172], [0, 10, 14, 22, 33, 50, 74, 111, 157, 240, 263, 277, 291, 305, 320, 350]], 6150: ['Griffe de serpent', 5, [0, 0, 150, 242], [0, 15, 20, 32, 45, 68, 98, 146, 206, 313, 344, 362, 380, 399, 418, 457]], 6500: ['Griffe de kyanite', 5, [0, 0, 93, 138], [140, 160, 170, 170, 180, 190, 210, 230, 240, 250]], 7000: ['Éventail', 6, [13, 15, 11, 15], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 7010: ['Éventail de fer', 6, [14, 22, 11, 17], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 7020: ['Éventail du tigre noir', 6, [18, 28, 13, 19], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 7030: ['Éventail aile de grue', 6, [24, 32, 17, 21], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 7040: ['Éventail du paon', 6, [29, 33, 18, 24], [0, 7, 14, 21, 28, 35, 42, 49, 56, 63]], 7050: ['Éventail aquatique', 6, [29, 39, 27, 41], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 7060: ['Éventail de pierre', 6, [33, 47, 30, 46], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 7070: ["Éventail de l'océan", 6, [30, 62, 35, 45], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 7080: ['Éventail de piqûre', 6, [42, 60, 37, 53], [0, 6, 12, 18, 24, 32, 41, 51, 62, 74]], 7090: ['Éventail du phoenix', 6, [59, 89, 50, 64], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 7100: ['Éventail triple', 6, [68, 90, 49, 73], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 7110: ['Éventails de cils', 6, [70, 100, 52, 78], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 7120: ['Éventail soleil noir', 6, [83, 97, 55, 83], [0, 5, 10, 15, 20, 27, 35, 44, 54, 65]], 7130: ['Event. oiseau céleste', 6, [83, 97, 64, 96], [0, 8, 17, 27, 38, 50, 63, 77, 102, 137]], 7140: ['Éventail du salut', 6, [95, 115, 69, 91], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 7150: ["Éventail d'extase", 6, [95, 115, 69, 91], [0, 6, 13, 21, 30, 40, 51, 63, 76, 90]], 7160: ["Éventail vent d'autom.", 6, [45, 76, 43, 55], [0, 6, 11, 17, 22, 30, 38, 48, 58, 70]], 7190: ['Éventail démoniaque', 6, [90, 115, 65, 85], [100, 100, 100, 100, 150, 150, 150, 150, 200, 200]], 7300: ['Éventail du zodiaque', 6, [160, 240, 115, 173], [0, 8, 11, 17, 26, 40, 59, 88, 133, 200]], 7310: ['Évent. dragon obscur', 6, [157, 243, 119, 176], [0, 8, 11, 17, 26, 40, 59, 88, 123, 192, 218, 231, 245, 259, 274, 304]], 7330: ['Éventail serpent', 6, [204, 337, 155, 244], [0, 13, 17, 25, 35, 55, 80, 117, 163, 256, 290, 306, 325, 343, 363, 402]], 7370: ['Event. dragon couché', 6, [160, 240, 115, 173], [0, 8, 11, 17, 26, 40, 59, 88, 133, 200]], 7500: ['Éventail de kyanite', 6, [160, 240, 86, 146], [140, 160, 170, 170, 180, 190, 210, 230, 240, 250]], 21900: ['Justicier de Durandal', 0, [15, 19, 13, 15], [49]], 21901: ['Cure-dent assassin', 1, [0, 0, 8, 11], [28]], 21902: ['Capteur de rêves', 2, [0, 0, 7, 29], [56]], 21903: ["Boucher d'orcs", 3, [0, 0, 14, 22], [56]], 21904: ["Baiser d'elfe", 4, [10, 18, 13, 15], [35]], 21905: ['Justicier des veuves', 6, [14, 22, 11, 17], [49]], 21906: ['Foudre et tonnerre', 5, [15, 19, 13, 15], [49]], 21910: ['Fureur ardente', 0, [20, 24, 20, 24], [49]], 21911: ["Capture d'elfe", 1, [0, 0, 13, 15], [28]], 21912: ['Complainte', 2, [0, 0, 19, 57], [56]], 21913: ["Marteau d'obsidienne", 3, [0, 0, 24, 42], [56]], 21914: ['Appel des Valkyries', 4, [10, 18, 13, 15], [49]], 21915: ['Malédiction silencieuse', 6, [18, 28, 13, 19], [49]], 21916: ['Rapaces', 5, [15, 19, 13, 17], [49]], 21920: ['Lame du destin', 0, [20, 28, 25, 35], [49]], 21921: ['Pique du vent', 1, [0, 0, 15, 19], [28]], 21922: ['Souffle du dragon', 2, [0, 0, 40, 88], [56]], 21923: ['Pacte de sang', 3, [0, 0, 34, 52], [56]], 21924: ['Appel de la tempête', 4, [19, 27, 25, 35], [49]], 21925: ["Danseur de l'ombre", 6, [29, 33, 18, 24], [49]], 21926: ['Disséqueur', 5, [15, 19, 16, 23], [49]], 21930: ["Voleur d'âmes", 0, [36, 46, 38, 52], [51]], 21931: ['Trancheur psychique', 1, [0, 0, 30, 36], [30]], 21932: ['Messager de la tempête', 2, [0, 0, 62, 128], [58]], 21933: ['Le jugement', 3, [0, 0, 58, 88], [51]], 21934: ['Hall du tonnerre', 4, [30, 38, 29, 39], [51]], 21935: ['Bruit du vent', 6, [33, 47, 30, 46], [51]], 21936: ['Éventreur psychique', 5, [0, 0, 40, 44], [27]], 21940: ["Bruit de l'acier", 0, [48, 58, 52, 68], [51]], 21941: ['Scalpel du clair de lune', 1, [0, 0, 36, 40], [30]], 21942: ["Feuille de l'ombre", 2, [0, 0, 65, 194], [58]], 21943: ['Armageddon', 3, [0, 0, 69, 103], [51]], 21944: ['Son glorieux', 4, [42, 48, 42, 60], [51]], 21945: ['Griffe de corbeau', 6, [42, 60, 37, 53], [51]], 21946: ['Griffes du destin', 5, [0, 0, 57, 73], [10]], 21950: ['Héritage de Balmung', 0, [65, 87, 69, 91], [44]], 21951: ['Fée de la mort', 1, [0, 0, 48, 56], [23]], 21952: ['Voix des titans', 2, [0, 0, 116, 216], [51]], 21953: ['Grondement de tonnerre', 3, [0, 0, 85, 139], [44]], 21954: ['Furie chantante', 4, [43, 67, 59, 89], [44]], 21955: ['Tessen de Bélial', 6, [68, 90, 49, 73], [44]], 21956: ['Griffes du tourment', 5, [0, 0, 57, 73], [34]], 21960: ['Askalahel', 0, [74, 100, 72, 108], [44]], 21961: ['Épine furieuse', 1, [0, 0, 53, 65], [23]], 21962: ['Tendon des dieux', 2, [0, 0, 135, 251], [51]], 21963: ['Crépuscule des dieux', 3, [0, 0, 102, 156], [44]], 21964: ['Coup final', 4, [65, 75, 76, 104], [44]], 21965: ['Nexus', 6, [83, 97, 55, 83], [44]], 21966: ['Pattes de velours', 5, [0, 0, 69, 91], [44]], 21970: ['Requiem', 0, [90, 110, 46, 87], [77]], 21971: ['Assassin de roi', 1, [0, 0, 74, 86], [63]], 21972: ['Épendrion', 2, [0, 0, 190, 290], [63]], 21973: ['Brachindul', 3, [0, 0, 126, 194], [63]], 21974: ['Baiser de la mort', 4, [16, 61, 91, 129], [77]], 21975: ['Kor Glâsh', 6, [52, 81, 64, 96], [77]], 21976: ['Fureur aveugle', 5, [0, 0, 72, 108], [44]]}
    
    function isValueInArray(value, array) {
      return array.indexOf(value) !== -1;
    }

    function compareNumbers(a, b) {
      return b - a;
    }

    function floorMultiplication(firstFactor, secondFactor) {
      return Math.floor((firstFactor * secondFactor).toFixed(8));
    }

    function floorMultiplicationWithNegative(firstFactor, secondFactor) {
      if (firstFactor < 0) {
        if (secondFactor < 0) {
          return floorMultiplication(-firstFactor, -secondFactor);
        } else {
          return -floorMultiplication(-firstFactor, secondFactor);
        }
      } else {
        if (secondFactor < 0) {
          return -floorMultiplication(firstFactor, -secondFactor);
        } else {
          return floorMultiplication(firstFactor, secondFactor);
        }
      }
    }

    function truncateNumber(number, precision) {
      return Math.floor(number * 10 ** precision) / 10 ** precision;
    }

    function addKeyValue(object, key, value) {
      if (object.hasOwnProperty(key)) {
        object[key] += value;
      } else {
        object[key] = value;
      }
    }

    function isBow(weapon) {
      return weapon[1] === 2;
    }

    function isRiding(character) {
      return character.state === "horse";
    }

    function isPolymorph(character) {
      return character.state === "polymorph";
    }

    function calcAttackFactor(attacker, victim) {
      function calcCoeffK(dex, level) {
        return Math.min(90, Math.floor((2 * dex + level) / 3));
      }

      var K1 = calcCoeffK(attacker.polymorphDex, attacker.level);
      var K2 = calcCoeffK(victim.polymorphDex, attacker.level);

      var AR = (K1 + 210) / 300;
      var ER = (((2 * K2 + 5) / (K2 + 95)) * 3) / 10;

      return truncateNumber(AR - ER, 8);
    }

    function calcMainAttackValue(attacker, attackerWeapon) {
      var leadership = 0;
      var rawWeaponAttackValue = 0;

      if (isPC(attacker)) {
        var rawWeaponAttackValue = attackerWeapon[3][attacker.weaponUpgrade];

        if (!rawWeaponAttackValue) {
          rawWeaponAttackValue = 0;
        }

        leadership = attacker.leadership;
      }

      return 2 * (attacker.level + rawWeaponAttackValue) + leadership;
    }

    function calcStatAttackValue(character) {
      switch (character.race) {
        case "warrior":
        case "sura":
          return 2 * character.str;
        case "ninja":
          return Math.floor((1 / 4) * (character.str + 7 * character.dex));
        case "shaman":
          return Math.floor((1 / 3) * (5 * character.int + character.dex));
        case "lycan":
          return character.vit + 2 * character.dex;
        default:
          return 2 * character.str;
      }
    }

    function calcSecondaryAttackValue(attacker, attackerWeapon) {
      var attackValueOther = 0;

      var minAttackValue = 0;
      var maxAttackValue = 0;

      var minAttackValueSlash = 0;
      var maxAttackValueSlash = 0;

      if (isPC(attacker)) {
        if (isValueInArray("serpent", attackerWeapon[0].toLowerCase())) {
          var rawAttackValue = attackerWeapon[3][attacker.weaponUpgrade];

          minAttackValue = attacker.minAttackValueRandom - rawAttackValue;
          maxAttackValue = attacker.maxAttackValueRandom - rawAttackValue;

          minAttackValue = Math.max(0, minAttackValue);
          maxAttackValue = Math.max(minAttackValue, maxAttackValue);
        } else {
          minAttackValue = attackerWeapon[2][2];
          maxAttackValue = attackerWeapon[2][3];
        }

        minAttackValueSlash = Math.min(
          attacker.minAttackValueSlash,
          attacker.maxAttackValueSlash
        );
        maxAttackValueSlash = Math.max(
          attacker.minAttackValueSlash,
          attacker.maxAttackValueSlash
        );

        attackValueOther += attacker.attackValue;

        if (isBow(attackerWeapon) && !isPolymorph(attacker)) {
          attackValueOther += 25;
        }
      } else {
        minAttackValue = attacker.minAttackValue;
        maxAttackValue = attacker.maxAttackValue;
      }

      minAttackValue += attacker.minAttackValuePolymorph;
      maxAttackValue += attacker.maxAttackValuePolymorph;

      attackValueOther += attacker.statAttackValue;
      attackValueOther += attacker.horseAttackValue;

      var weaponInterval = maxAttackValue - minAttackValue + 1;
      var slashInterval = maxAttackValueSlash - minAttackValueSlash + 1;

      var totalCardinal = weaponInterval * slashInterval * 1000000;
      var minInterval = Math.min(weaponInterval, slashInterval);

      minAttackValue += minAttackValueSlash;
      maxAttackValue += maxAttackValueSlash;

      return [
        minAttackValue,
        maxAttackValue,
        attackValueOther,
        minInterval,
        totalCardinal,
      ];
    }

    function calcMagicAttackValue(attacker, attackerWeapon) {
      var minMagicAttackValue = 0;
      var maxMagicAttackValue = 0;

      var minMagicAttackValueSlash = 0;
      var maxMagicAttackValueSlash = 0;

      if (isValueInArray("serpent", attackerWeapon[0].toLowerCase())) {
        minMagicAttackValue = attacker.minMagicAttackValueRandom;
        maxMagicAttackValue = attacker.maxMagicAttackValueRandom;

        maxMagicAttackValue = Math.max(minMagicAttackValue, maxMagicAttackValue);
      } else {
        var rawWeaponAttackValue = attackerWeapon[3][attacker.weaponUpgrade];

        if (!rawWeaponAttackValue) {
          rawWeaponAttackValue = 0;
        }

        minMagicAttackValue = attackerWeapon[2][0] + rawWeaponAttackValue;
        maxMagicAttackValue = attackerWeapon[2][1] + rawWeaponAttackValue;
      }

      minMagicAttackValueSlash = Math.min(
        attacker.minMagicAttackValueSlash,
        attacker.maxMagicAttackValueSlash
      );
      maxMagicAttackValueSlash = Math.max(
        attacker.minMagicAttackValueSlash,
        attacker.maxMagicAttackValueSlash
      );

      var weaponInterval = maxMagicAttackValue - minMagicAttackValue + 1;
      var slashInterval = maxMagicAttackValueSlash - minMagicAttackValueSlash + 1;

      var totalCardinal = weaponInterval * slashInterval * 1000000;
      var minInterval = Math.min(weaponInterval, slashInterval);

      minMagicAttackValue += minMagicAttackValueSlash;
      maxMagicAttackValue += maxMagicAttackValueSlash;

      return [
        minMagicAttackValue,
        maxMagicAttackValue,
        minInterval,
        totalCardinal,
      ];
    }

    function getPolymorphPower(polymorphPoint, polymorphPowerTable) {
      return polymorphPowerTable[polymorphPoint];
    }

    function getSkillPower(skillPoint, skillPowerTable) {
      return skillPowerTable[skillPoint];
    }

    function getMarriageBonusValue(character, marriageTable, itemName) {
      var index;
      var lovePoint = character.lovePoint;

      if (lovePoint < 65) {
        index = 0;
      } else if (lovePoint < 80) {
        index = 1;
      } else if (lovePoint < 100) {
        index = 2;
      } else {
        index = 3;
      }

      return marriageTable[itemName][index];
    }

    function calcDamageWithPrimaryBonuses(damages, battleValues) {
      damages = floorMultiplication(
        damages * battleValues.attackValueCoeff + battleValues.adjustCoeff,
        1
      );
      damages += battleValues.attackValueMarriage;
      damages = floorMultiplication(
        damages,
        battleValues.monsterResistanceMarriageCoeff
      );
      damages = floorMultiplication(damages, battleValues.monsterResistanceCoeff);
      damages = floorMultiplication(damages, battleValues.typeBonusCoeff);
      damages +=
        floorMultiplication(damages, battleValues.raceBonusCoeff) -
        floorMultiplication(damages, battleValues.raceResistanceCoeff);
      damages = floorMultiplication(damages, battleValues.stoneBonusCoeff);
      damages = floorMultiplication(damages, battleValues.monsterBonusCoeff);

      var elementDamages = 0;
      for (var elementBonusCoeff of battleValues.elementBonusCoeff) {
        elementDamages += floorMultiplicationWithNegative(
          damages,
          elementBonusCoeff
        );
      }
      damages += elementDamages;

      damages = floorMultiplication(damages, battleValues.damageMultiplier);

      return damages;
    }

    function calcDamageWithSecondaryBonuses(
      damages,
      battleValues,
      damagesType,
      minPiercingDamages,
      damagesWithPrimaryBonuses
    ) {
      damages = floorMultiplication(damages, battleValues.magicResistanceCoeff);
      damages = floorMultiplication(damages, battleValues.weaponDefenseCoeff);
      damages = floorMultiplication(damages, battleValues.tigerStrengthCoeff);
      damages = floorMultiplication(damages, battleValues.blessingBonusCoeff);

      if (damagesType.criticalHit) {
        damages *= 2;
      }

      if (damagesType.piercingHit) {
        damages += battleValues.defense + Math.min(0, minPiercingDamages);
        damages += floorMultiplication(
          damagesWithPrimaryBonuses,
          battleValues.extraPiercingHitCoeff
        );
      }

      damages = floorMultiplication(damages, battleValues.averageDamageCoeff);
      damages = floorMultiplication(
        damages,
        battleValues.averageDamageResistanceCoeff
      );
      damages = floorMultiplication(
        damages,
        battleValues.skillDamageResistanceCoeff
      );

      damages = floorMultiplication(damages, battleValues.rankBonusCoeff);
      damages = Math.max(0, damages + battleValues.defensePercent);
      damages += Math.min(
        300,
        floorMultiplication(damages, battleValues.damageBonusCoeff)
      );
      damages = floorMultiplication(damages, battleValues.empireMalusCoeff);
      damages = floorMultiplication(damages, battleValues.sungMaStrBonusCoeff);
      damages -= floorMultiplication(damages, battleValues.sungmaStrMalusCoeff);

      damages = floorMultiplication(damages, battleValues.whiteDragonElixirCoeff);
      damages = floorMultiplication(damages, battleValues.steelDragonElixirCoeff);

      return damages;
    }

    function calcSkillDamageWithSecondaryBonuses(
      damages,
      battleValues,
      damagesType,
      minPiercingDamages
    ) {
      damages = floorMultiplication(damages, battleValues.magicResistanceCoeff);
      damages = floorMultiplication(damages, battleValues.weaponDefenseCoeff);

      damages -= battleValues.defense;

      damages = floorMultiplication(damages, battleValues.skillWardCoeff);
      damages = floorMultiplication(damages, battleValues.skillBonusCoeff);

      var tempDamages = floorMultiplication(
        damages,
        battleValues.skillBonusByBonusCoeff
      );

      damages = floorMultiplication(tempDamages, battleValues.tigerStrengthCoeff);

      if (damagesType.criticalHit) {
        damages *= 2;
      }

      if (damagesType.piercingHit) {
        damages +=
          battleValues.piercingHitDefense + Math.min(0, minPiercingDamages);
        damages += floorMultiplication(
          tempDamages,
          battleValues.extraPiercingHitCoeff
        );
      }

      damages = floorMultiplication(damages, battleValues.skillDamageCoeff);
      damages = floorMultiplication(
        damages,
        battleValues.skillDamageResistanceCoeff
      );

      damages = floorMultiplication(damages, battleValues.rankBonusCoeff);
      damages = Math.max(0, damages + battleValues.defensePercent);
      damages += Math.min(
        300,
        floorMultiplication(damages, battleValues.damageBonusCoeff)
      );
      damages = floorMultiplication(damages, battleValues.empireMalusCoeff);
      damages = floorMultiplication(damages, battleValues.sungMaStrBonusCoeff);
      damages -= floorMultiplication(damages, battleValues.sungmaStrMalusCoeff);

      damages = floorMultiplication(damages, battleValues.whiteDragonElixirCoeff);
      damages = floorMultiplication(damages, battleValues.steelDragonElixirCoeff);

      return damages;
    }

    function computePolymorphPoint(attacker, victim, polymorphPowerTable) {
      attacker.statAttackValue = 0;

      attacker.polymorphDex = attacker.dex;
      victim.polymorphDex = victim.dex;

      attacker.minAttackValuePolymorph = 0;
      attacker.maxAttackValuePolymorph = 0;

      if (isPC(attacker) && isPolymorph(attacker) && polymorphPowerTable) {
        var polymorphPowerPct =
          getPolymorphPower(attacker.polymorphPoint, polymorphPowerTable) / 100;
        var polymorphMonster = createMonster(attacker.polymorphMonster);

        var polymorphStr = floorMultiplication(
          polymorphPowerPct,
          polymorphMonster.str
        );

        attacker.polymorphDex += floorMultiplication(
          polymorphPowerPct,
          polymorphMonster.dex
        );

        attacker.minAttackValuePolymorph = floorMultiplication(
          polymorphPowerPct,
          polymorphMonster.minAttackValue
        );
        attacker.maxAttackValuePolymorph = floorMultiplication(
          polymorphPowerPct,
          polymorphMonster.maxAttackValue
        );

        if (!attacker.weapon) {
          attacker.maxAttackValuePolymorph += 1;
        }

        attacker.attackValue = 0;

        if (isMagicClass(attacker)) {
          attacker.statAttackValue = 2 * (polymorphStr + attacker.int);
        } else {
          attacker.statAttackValue = 2 * (polymorphStr + attacker.str);
        }
      } else {
        attacker.statAttackValue = calcStatAttackValue(attacker);
      }
    }

    function computeHorse(attacker) {
      attacker.horseAttackValue = 0;

      if (isPC(attacker) && isRiding(attacker)) {
        var horseConstant = 30;

        if (attacker.class === "weaponary") {
          horseConstant = 60;
        }

        attacker.horseAttackValue = floorMultiplication(
          2 * attacker.level + attacker.statAttackValue,
          attacker.horsePoint / horseConstant
        );
      }
    }

    function getRankBonus(attacker) {
      if (attacker.lowRank !== "on") {
        return 0;
      }

      switch (attacker.playerRank) {
        case "aggressive":
          return 1;
        case "fraudulent":
          return 2;
        case "malicious":
          return 3;
        case "cruel":
          return 5;
      }

      return 0;
    }

    function calcElementCoeffPvP(elementBonus, mapping, attacker, victim) {
      var minElementMalus = 0;
      var maxDifference = 0;
      var savedElementDifferences = [];
      var elementBonusIndex = 0;

      for (var index = 0; index < elementBonus.length; index++) {
        if (!attacker[mapping.elementBonus[index]]) {
          continue;
        }

        var elementDifference =
          attacker[mapping.elementBonus[index]] -
          victim[mapping.elementResistance[index]];

        if (elementDifference >= 0) {
          elementBonus[elementBonusIndex] = elementDifference / 1000;
          minElementMalus -= elementDifference;
          maxDifference = Math.max(maxDifference, elementDifference);
          elementBonusIndex++;
        } else {
          savedElementDifferences.push(elementDifference);
        }
      }

      if (!savedElementDifferences.length) {
        return;
      }

      minElementMalus += maxDifference;
      savedElementDifferences.sort(compareNumbers);

      for (var index = 0; index < savedElementDifferences.length; index++) {
        var elementDifference = savedElementDifferences[index];

        elementBonus[elementBonusIndex + index] =
          Math.max(minElementMalus, elementDifference) / 1000;

        minElementMalus = Math.min(
          0,
          Math.max(minElementMalus, minElementMalus - elementDifference)
        );
      }
    }

    function skillChanceReduction(value) {
      if (value <= 9) {
        return Math.floor(value / 2);
      }
      return 5 + Math.floor((value - 10) / 4);
    }

    function magicResistanceToCoeff(magicResistance) {
      if (magicResistance) {
        return 2000 / (6 * magicResistance + 1000) - 1;
      }
      return 1;
    }

    function createPhysicalBattleValues(
      attacker,
      attackerWeapon,
      victim,
      mapping,
      polymorphPowerTable,
      marriageTable,
      skillPowerTable
    ) {
      var missPercentage = 0;
      var attackValuePercent = 0;
      var attackMeleeMagic = 0;
      var attackValueMarriage = 0;
      var monsterResistanceMarriage = 0;
      var monsterResistance = 0;
      var typeBonus = 0;
      var raceBonus = 0;
      var raceResistance = 0;
      var stoneBonus = 0;
      var monsterBonus = 0;
      var elementBonus = [0, 0, 0, 0, 0, 0]; // fire, ice, lightning, earth, darkness, wind, order doesn't matter
      var defenseMarriage = 0;
      var damageMultiplier = 1;
      var magicResistance = 0;
      var weaponDefense = 0;
      var tigerStrength = 0;
      var blessingBonus = 0;
      var criticalHitPercentage = attacker.criticalHit;
      var piercingHitPercentage = attacker.piercingHit;
      var extraPiercingHitPercentage = Math.max(0, piercingHitPercentage - 100);
      var averageDamage = 0;
      var averageDamageResistance = 0;
      var skillDamageResistance = 0;
      var rankBonus = 0;
      var defensePercent = 0;
      var damageBonus = 0;
      var empireMalus = 0;
      var sungMaStrBonus = 0;
      var sungmaStrMalus = 0;
      var whiteDragonElixir = 0;
      var steelDragonElixir = 0;

      computePolymorphPoint(attacker, victim, polymorphPowerTable);
      computeHorse(attacker);

      if (isPC(attacker)) {
        attackValuePercent = attacker.attackValuePercent;
        attackMeleeMagic = attacker.attackMeleeMagic;

        var weaponType = attackerWeapon[1];

        var weaponDefenseName = mapping.defenseWeapon[weaponType];
        var weaponDefenseBreakName = mapping.breakWeapon[weaponType];

        if (victim.hasOwnProperty(weaponDefenseName)) {
          weaponDefense = victim[weaponDefenseName];
        }

        if (attacker.whiteDragonElixir === "on") {
          whiteDragonElixir = 10;
        }

        if (isPC(victim)) {
          if (weaponType === 2 && !isPolymorph(attacker)) {
            missPercentage = victim.arrowBlock;
          } else {
            missPercentage = victim.meleeBlock;
          }

          missPercentage +=
            victim.meleeArrowBlock -
            (missPercentage * victim.meleeArrowBlock) / 100;

          typeBonus = Math.max(1, attacker.humanBonus - victim.humanResistance);
          raceBonus = attacker[mapping.raceBonus[victim.race]];
          raceResistance = victim[mapping.raceResistance[attacker.race]];

          calcElementCoeffPvP(elementBonus, mapping, attacker, victim);

          if (
            weaponType !== 2 &&
            attacker.hasOwnProperty(weaponDefenseBreakName)
          ) {
            weaponDefense -= attacker[weaponDefenseBreakName];
          }

          criticalHitPercentage = 0;
          blessingBonus = calcBlessingBonus(skillPowerTable, victim);
          averageDamageResistance = victim.averageDamageResistance;
        } else {
          if (attacker.isMarried === "on") {
            if (attacker.loveNecklace === "on") {
              attackValueMarriage = getMarriageBonusValue(
                attacker,
                marriageTable,
                "loveNecklace"
              );
            }

            if (attacker.loveEarrings === "on") {
              criticalHitPercentage += getMarriageBonusValue(
                attacker,
                marriageTable,
                "loveEarrings"
              );
            }

            if (attacker.harmonyEarrings === "on") {
              piercingHitPercentage += getMarriageBonusValue(
                attacker,
                marriageTable,
                "harmonyEarrings"
              );
            }
          }

          if (attacker.tigerStrength === "on") {
            tigerStrength = 40;
          }

          for (var index = 0; index < elementBonus.length; index++) {
            var elementBonusName = mapping.elementBonus[index];
            var elementResistanceName = mapping.elementResistance[index];

            if (attacker[elementBonusName] && victim[elementBonusName]) {
              elementBonus[index] =
                (attacker[elementBonusName] - victim[elementResistanceName]) /
                200;
            } else {
              elementBonus[index] = attacker[elementBonusName] / 2000;
            }
          }

          var victimType = victim.type;

          if (victimType !== -1) {
            typeBonus = attacker[mapping.typeFlag[victimType]];
          }

          monsterBonus = attacker.monsterBonus;

          if (isStone(victim)) {
            stoneBonus = attacker.stoneBonus;
          }

          if (isBoss(victim)) {
            averageDamage += attacker.bossDamage;
          }

          if (attacker.onYohara === "on") {
            var sungmaStrDifference =
              attacker.sungmaStr - attacker.sungmaStrMalus;

            if (sungmaStrDifference >= 0) {
              sungMaStrBonus = sungmaStrDifference;
            } else {
              sungmaStrMalus = 0.5;
            }
          }
        }

        averageDamage += attacker.averageDamage;
        rankBonus = getRankBonus(attacker);
        damageBonus = attacker.damageBonus;

        if (attacker.empireMalus === "on") {
          empireMalus = 10;
        }
      } else {
        if (isPC(victim)) {
          if (victim.isMarried === "on") {
            if (victim.harmonyBracelet === "on") {
              monsterResistanceMarriage = getMarriageBonusValue(
                victim,
                marriageTable,
                "harmonyBracelet"
              );
            }

            if (victim.harmonyNecklace === "on") {
              defenseMarriage = getMarriageBonusValue(
                victim,
                marriageTable,
                "harmonyNecklace"
              );
            }
          }

          monsterResistance = victim.monsterResistance;

          for (var index = 0; index < elementBonus.length; index++) {
            var elementBonusName = mapping.elementBonus[index];
            var elementResistanceName = mapping.elementResistance[index];

            if (attacker[elementBonusName]) {
              elementBonus[index] =
                (attacker[elementBonusName] - victim[elementResistanceName]) /
                125;
            }
          }

          if (attacker.attack == 0) {
            missPercentage = victim.meleeBlock;
            averageDamageResistance = victim.averageDamageResistance;
            blessingBonus = calcBlessingBonus(skillPowerTable, victim);
          } else if (attacker.attack == 1) {
            missPercentage = victim.arrowBlock;
            weaponDefense = victim.arrowDefense;
            averageDamageResistance = victim.averageDamageResistance;
            blessingBonus = calcBlessingBonus(skillPowerTable, victim);
          } else {
            missPercentage = victim.arrowBlock;
            skillDamageResistance = victim.skillDamageResistance;
            magicResistance = victim.magicResistance;
          }

          missPercentage +=
            victim.meleeArrowBlock -
            (missPercentage * victim.meleeArrowBlock) / 100;
        }

        typeBonus = 1;
        damageMultiplier = attacker.damageMultiplier;
      }

      if (isPC(victim)) {
        if (victim.biologist70 === "on") {
          victim.defense = floorMultiplication(victim.defense, 1.1);
        }
        criticalHitPercentage = Math.max(
          0,
          criticalHitPercentage - victim.criticalHitResistance
        );
        piercingHitPercentage = Math.max(
          0,
          piercingHitPercentage - victim.piercingHitResistance
        );

        if (isMagicClass(victim)) {
          defensePercent =
            (-2 * victim.magicDefense * victim.defensePercent) / 100;
        } else {
          defensePercent = (-2 * victim.defense * victim.defensePercent) / 100;
        }

        if (victim.steelDragonElixir === "on") {
          steelDragonElixir = 10;
        }
      }

      missPercentage = Math.min(100, missPercentage);

      var battleValues = {
        missPercentage: missPercentage,
        adjustCoeff: 0,
        attackValueCoeff:
          1 + (attackValuePercent + Math.min(100, attackMeleeMagic)) / 100,
        attackValueMarriage: attackValueMarriage,
        monsterResistanceMarriageCoeff: 1 - monsterResistanceMarriage / 100,
        monsterResistanceCoeff: 1 - monsterResistance / 100,
        typeBonusCoeff: 1 + typeBonus / 100,
        raceBonusCoeff: raceBonus / 100,
        raceResistanceCoeff: raceResistance / 100,
        monsterBonusCoeff: 1 + monsterBonus / 100,
        stoneBonusCoeff: 1 + stoneBonus / 100,
        elementBonusCoeff: elementBonus,
        damageMultiplier: damageMultiplier,
        defense: victim.defense,
        defenseMarriage: defenseMarriage,
        magicResistanceCoeff: magicResistanceToCoeff(magicResistance),
        weaponDefenseCoeff: 1 - weaponDefense / 100,
        tigerStrengthCoeff: 1 + tigerStrength / 100,
        blessingBonusCoeff: 1 - blessingBonus / 100,
        extraPiercingHitCoeff: extraPiercingHitPercentage / 200,
        averageDamageCoeff: 1 + averageDamage / 100,
        averageDamageResistanceCoeff:
          1 - Math.min(99, averageDamageResistance) / 100,
        skillDamageResistanceCoeff: 1 - Math.min(99, skillDamageResistance) / 100,
        rankBonusCoeff: 1 + rankBonus / 100,
        defensePercent: Math.floor(defensePercent),
        damageBonusCoeff: damageBonus / 100,
        empireMalusCoeff: 1 - empireMalus / 100,
        sungMaStrBonusCoeff: 1 + sungMaStrBonus / 10000,
        sungmaStrMalusCoeff: sungmaStrMalus,
        whiteDragonElixirCoeff: 1 + whiteDragonElixir / 100,
        steelDragonElixirCoeff: 1 - steelDragonElixir / 100,
      };

      criticalHitPercentage = Math.min(criticalHitPercentage, 100);
      piercingHitPercentage = Math.min(piercingHitPercentage, 100);

      battleValues.damagesTypeCombinaison = [
        {
          criticalHit: false,
          piercingHit: false,
          weight:
            (100 - criticalHitPercentage) *
            (100 - piercingHitPercentage) *
            (100 - missPercentage),
          name: "normalHit",
        },
        {
          criticalHit: true,
          piercingHit: false,
          weight:
            criticalHitPercentage *
            (100 - piercingHitPercentage) *
            (100 - missPercentage),
          name: "criticalHit",
        },
        {
          criticalHit: false,
          piercingHit: true,
          weight:
            (100 - criticalHitPercentage) *
            piercingHitPercentage *
            (100 - missPercentage),
          name: "piercingHit",
        },
        {
          criticalHit: true,
          piercingHit: true,
          weight:
            criticalHitPercentage *
            piercingHitPercentage *
            (100 - missPercentage),
          name: "criticalPiercingHit",
        },
      ];

      return battleValues;
    }

    function createSkillBattleValues(
      attacker,
      attackerWeapon,
      victim,
      mapping,
      marriageTable,
      magicSkill
    ) {
      var adjustCoeff = 0;
      var attackValuePercent = 0;
      var attackMeleeMagic = 0;
      var attackValueMarriage = 0;
      var monsterResistanceMarriage = 0;
      var monsterResistance = 0;
      var typeBonus = 0;
      var raceBonus = 0;
      var raceResistance = 0;
      var stoneBonus = 0;
      var monsterBonus = 0;
      var elementBonus = [0, 0, 0, 0, 0, 0]; // fire, ice, lightning, earth, darkness, wind, order doesn't matter
      var damageMultiplier = 1;
      var useDamages = 1;
      var defense = victim.defense;
      var magicResistance = 0;
      var weaponDefense = 0;
      var tigerStrength = 0;
      var criticalHitPercentage = attacker.criticalHit;
      var piercingHitPercentage = attacker.piercingHit;
      var extraPiercingHitPercentage = Math.max(0, piercingHitPercentage - 100);
      var skillDamage = 0;
      var skillDamageResistance = 0;
      var rankBonus = 0;
      var defensePercent = 0;
      var damageBonus = 0;
      var empireMalus = 0;
      var sungMaStrBonus = 0;
      var sungmaStrMalus = 0;
      var whiteDragonElixir = 0;
      var steelDragonElixir = 0;

      computePolymorphPoint(attacker, victim);
      computeHorse(attacker);

      if (isPC(attacker)) {
        attackValuePercent = attacker.attackValuePercent;
        attackMeleeMagic = attacker.attackMeleeMagic;

        var weaponType = attackerWeapon[1];

        if (attacker.class === "archery") {
          if (weaponType !== 2) {
            useDamages = 0;
            weaponType = 2;
          }
          defense = 0;
        }

        var weaponDefenseName = mapping.defenseWeapon[weaponType];
        var weaponDefenseBreakName = mapping.breakWeapon[weaponType];

        if (victim.hasOwnProperty(weaponDefenseName)) {
          weaponDefense = victim[weaponDefenseName];
        }

        if (attacker.whiteDragonElixir === "on") {
          whiteDragonElixir = 10;
        }

        if (isPC(victim)) {
          typeBonus = Math.max(1, attacker.humanBonus - victim.humanResistance);
          raceBonus = attacker[mapping.raceBonus[victim.race]];
          raceResistance = victim[mapping.raceResistance[attacker.race]];

          calcElementCoeffPvP(elementBonus, mapping, attacker, victim);

          if (
            weaponType !== 2 &&
            attacker.hasOwnProperty(weaponDefenseBreakName)
          ) {
            weaponDefense -= attacker[weaponDefenseBreakName];
          }

          criticalHitPercentage = 0;
        } else {
          if (attacker.isMarried === "on") {
            if (attacker.loveNecklace === "on") {
              attackValueMarriage = getMarriageBonusValue(
                attacker,
                marriageTable,
                "loveNecklace"
              );
            }

            if (attacker.loveEarrings === "on") {
              criticalHitPercentage += getMarriageBonusValue(
                attacker,
                marriageTable,
                "loveEarrings"
              );
            }

            if (attacker.harmonyEarrings === "on") {
              piercingHitPercentage += getMarriageBonusValue(
                attacker,
                marriageTable,
                "harmonyEarrings"
              );
            }
          }

          if (attacker.tigerStrength === "on") {
            tigerStrength = 40;
          }

          for (var index = 0; index < elementBonus.length; index++) {
            var elementBonusName = mapping.elementBonus[index];
            var elementResistanceName = mapping.elementResistance[index];

            if (attacker[elementBonusName] && victim[elementBonusName]) {
              elementBonus[index] =
                (attacker[elementBonusName] - victim[elementResistanceName]) /
                200;
            } else {
              elementBonus[index] = attacker[elementBonusName] / 2000;
            }
          }

          var victimType = victim.type;

          if (victimType !== -1) {
            typeBonus = attacker[mapping.typeFlag[victimType]];
          }

          monsterBonus = attacker.monsterBonus;

          if (isStone(victim)) {
            stoneBonus = attacker.stoneBonus;
          }

          if (isBoss(victim)) {
            skillDamage += attacker.skillBossDamage;
          }

          if (attacker.onYohara === "on") {
            var sungmaStrDifference =
              attacker.sungmaStr - attacker.sungmaStrMalus;

            if (sungmaStrDifference >= 0) {
              sungMaStrBonus = sungmaStrDifference;
            } else {
              sungmaStrMalus = 0.5;
            }
          }
        }

        skillDamage += attacker.skillDamage;
        rankBonus = getRankBonus(attacker);
        damageBonus = attacker.damageBonus;

        if (attacker.empireMalus === "on") {
          empireMalus = 10;
        }
      } else {
        if (isPC(victim)) {
          if (victim.isMarried === "on" && victim.harmonyBracelet === "on") {
            monsterResistanceMarriage = getMarriageBonusValue(
              victim,
              marriageTable,
              "harmonyBracelet"
            );
          }

          monsterResistance = victim.monsterResistance;

          for (var index = 0; index < elementBonus.length; index++) {
            var elementBonusName = mapping.elementBonus[index];
            var elementResistanceName = mapping.elementResistance[index];

            if (attacker[elementBonusName]) {
              elementBonus[index] =
                (attacker[elementBonusName] - victim[elementResistanceName]) /
                125;
            }
          }
        }

        typeBonus = 1;
        damageMultiplier = attacker.damageMultiplier;
      }

      criticalHitPercentage = skillChanceReduction(criticalHitPercentage);
      piercingHitPercentage = skillChanceReduction(piercingHitPercentage);

      if (isPC(victim)) {
        criticalHitPercentage = Math.max(
          0,
          criticalHitPercentage - victim.criticalHitResistance
        );
        piercingHitPercentage = Math.max(
          0,
          piercingHitPercentage - victim.piercingHitResistance
        );
        skillDamageResistance = victim.skillDamageResistance;

        if (isMagicClass(victim)) {
          defensePercent =
            (-2 * victim.magicDefense * victim.defensePercent) / 100;
        } else {
          defensePercent = (-2 * victim.defense * victim.defensePercent) / 100;
        }

        if (victim.steelDragonElixir === "on") {
          steelDragonElixir = 10;
        }
      }

      if (magicSkill) {
        adjustCoeff = 0.5;
        attackValuePercent = attacker.attackMagic;
        attackValueMarriage = 0;
        defense = 0;
        if (!isDispell(attacker, 6)) {
          magicResistance = victim.magicResistance;
        }
        weaponDefense = 0;
      }

      var battleValues = {
        weaponBonusCoeff: 1,
        adjustCoeff: adjustCoeff,
        attackValueCoeff:
          1 + (attackValuePercent + Math.min(100, attackMeleeMagic)) / 100,
        attackValueMarriage: attackValueMarriage,
        monsterResistanceMarriageCoeff: 1 - monsterResistanceMarriage / 100,
        monsterResistanceCoeff: 1 - monsterResistance / 100,
        typeBonusCoeff: 1 + typeBonus / 100,
        raceBonusCoeff: raceBonus / 100,
        raceResistanceCoeff: raceResistance / 100,
        monsterBonusCoeff: 1 + monsterBonus / 100,
        stoneBonusCoeff: 1 + stoneBonus / 100,
        elementBonusCoeff: elementBonus,
        damageMultiplier: damageMultiplier,
        useDamages: useDamages,
        defense: defense,
        tigerStrengthCoeff: 1 + tigerStrength / 100,
        piercingHitDefense: victim.defense,
        magicResistanceCoeff: magicResistanceToCoeff(magicResistance),
        weaponDefenseCoeff: 1 - weaponDefense / 100,
        extraPiercingHitCoeff: extraPiercingHitPercentage / 200,
        skillDamageCoeff: 1 + skillDamage / 100,
        skillDamageResistanceCoeff: 1 - Math.min(99, skillDamageResistance) / 100,
        rankBonusCoeff: 1 + rankBonus / 100,
        defensePercent: Math.floor(defensePercent),
        damageBonusCoeff: damageBonus / 100,
        empireMalusCoeff: 1 - empireMalus / 100,
        sungMaStrBonusCoeff: 1 + sungMaStrBonus / 10000,
        sungmaStrMalusCoeff: sungmaStrMalus,
        whiteDragonElixirCoeff: 1 + whiteDragonElixir / 100,
        steelDragonElixirCoeff: 1 - steelDragonElixir / 100,
      };

      criticalHitPercentage = Math.min(criticalHitPercentage, 100);
      piercingHitPercentage = Math.min(piercingHitPercentage, 100);

      battleValues.damagesTypeCombinaison = [
        {
          criticalHit: false,
          piercingHit: false,
          weight:
            (100 - criticalHitPercentage) * (100 - piercingHitPercentage) * 100,
          name: "normalHit",
        },
        {
          criticalHit: true,
          piercingHit: false,
          weight: criticalHitPercentage * (100 - piercingHitPercentage) * 100,
          name: "criticalHit",
        },
        {
          criticalHit: false,
          piercingHit: true,
          weight: (100 - criticalHitPercentage) * piercingHitPercentage * 100,
          name: "piercingHit",
        },
        {
          criticalHit: true,
          piercingHit: true,
          weight: criticalHitPercentage * piercingHitPercentage * 100,
          name: "criticalPiercingHit",
        },
      ];

      return battleValues;
    }

    function updateBattleValues(battleValues, skillInfo, attackerWeapon) {
      var weaponBonus = 0;
      var skillWard = 0;
      var skillBonus = 0;
      var skillBonusByBonus = 0;

      if (skillInfo.hasOwnProperty("weaponBonus")) {
        var [weaponType, weaponBonusValue] = skillInfo.weaponBonus;

        if (weaponType === attackerWeapon[1]) {
          weaponBonus = weaponBonusValue;
        }
      }

      if (skillInfo.skillBonus) {
        skillBonus = skillInfo.skillBonus;
      }

      if (skillInfo.skillWard) {
        skillWard = skillInfo.skillWard;
      }

      if (skillInfo.skillBonusByBonus) {
        skillBonusByBonus = skillInfo.skillBonusByBonus;
      }

      if (skillInfo.removeWeaponReduction) {
        battleValues.weaponDefenseCoeff = 1;
      }

      battleValues.weaponBonusCoeff = 1 + weaponBonus / 100;
      battleValues.skillWardCoeff = 1 - skillWard / 100;
      battleValues.skillBonusCoeff = 1 + skillBonus / 100;
      battleValues.skillBonusByBonusCoeff = 1 + skillBonusByBonus / 100;
    }

    function calcPhysicalDamages(
      attacker,
      attackerWeapon,
      victim,
      tableResult,
      mapping,
      constants,
      damagesChart,
      numberFormat
    ) {
      var battleValues = createPhysicalBattleValues(
        attacker,
        attackerWeapon,
        victim,
        mapping,
        constants.polymorphPowerTable,
        constants.marriageTable,
        constants.skillPowerTable
      );

      var attackFactor = calcAttackFactor(attacker, victim);
      var mainAttackValue = calcMainAttackValue(attacker, attackerWeapon);
      var [
        minAttackValue,
        maxAttackValue,
        attackValueOther,
        minInterval,
        totalCardinal,
      ] = calcSecondaryAttackValue(attacker, attackerWeapon);

      var damagesWeightedByType = {};

      if (battleValues.missPercentage) {
        damagesWeightedByType.miss = battleValues.missPercentage / 100;
      }

      var lastWeightsLimit = maxAttackValue - minInterval + 1;
      var firstWeightLimit = minAttackValue + minInterval - 1;

      for (var damagesType of battleValues.damagesTypeCombinaison) {
        if (!damagesType.weight) {
          continue;
        }

        var damagesWeighted = {};
        damagesWeightedByType[damagesType.name] = damagesWeighted;

        for (
          var attackValue = minAttackValue;
          attackValue <= maxAttackValue;
          attackValue++
        ) {
          var weight;

          if (attackValue > lastWeightsLimit) {
            weight = maxAttackValue - attackValue + 1;
          } else if (attackValue < firstWeightLimit) {
            weight = attackValue - minAttackValue + 1;
          } else {
            weight = minInterval;
          }

          var secondaryAttackValue = 2 * attackValue + attackValueOther;
          var rawDamages =
            mainAttackValue +
            floorMultiplication(attackFactor, secondaryAttackValue);

          var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
            rawDamages,
            battleValues
          );

          var minPiercingDamages =
            damagesWithPrimaryBonuses -
            battleValues.defense +
            battleValues.defenseMarriage;

          if (minPiercingDamages <= 2) {
            for (var damages = 1; damages <= 5; damages++) {
              var finalDamages = calcDamageWithSecondaryBonuses(
                damages,
                battleValues,
                damagesType,
                minPiercingDamages,
                damagesWithPrimaryBonuses
              );

              addKeyValue(
                damagesWeighted,
                finalDamages,
                (weight * damagesType.weight) / 5
              );
            }
          } else {
            var finalDamages = calcDamageWithSecondaryBonuses(
              minPiercingDamages,
              battleValues,
              damagesType,
              minPiercingDamages,
              damagesWithPrimaryBonuses
            );

            addKeyValue(
              damagesWeighted,
              finalDamages,
              weight * damagesType.weight
            );
          }
        }
      }

      return {
        damagesWeightedByType: damagesWeightedByType,
        totalCardinal: totalCardinal,
      };
    }

    function calcBlessingBonus(skillPowerTable, victim) {
      if (victim.isBlessed !== "on") {
        return 0;
      }

      var int = victim.intBlessing;
      var dex = victim.dexBlessing;
      var skillPower = getSkillPower(victim["skillBlessing"], skillPowerTable);

      if (!skillPower) {
        return 0;
      }

      var blessingBonus = floorMultiplication(
        ((int * 0.3 + 5) * (2 * skillPower + 0.5) + 0.3 * dex) /
          (skillPower + 2.3),
        1
      );

      if (victim.class === "dragon" && victim.blessingOnself === "on") {
        blessingBonus = floorMultiplication(blessingBonus, 1.1);
      }

      return blessingBonus;
    }

    function getSkillFormula(
      skillPowerTable,
      skillId,
      attacker,
      attackFactor,
      victim
    ) {
      var skillFormula;
      var skillInfo = {};

      var attackerClass = attacker.class;
      var lv = attacker.level;
      var vit = attacker.vit;
      var str = attacker.str;
      var int = attacker.int;
      var dex = attacker.dex;

      if (skillId <= 9) {
        var skillPower = getSkillPower(
          attacker["attackSkill" + skillId],
          skillPowerTable
        );

        var improvedBySkillBonus = false;
        var improvedByBonus = false;

        if (attackerClass === "body") {
          switch (skillId) {
            // Triple lacération
            case 1:
              skillFormula = function (atk) {
                return floorMultiplication(
                  1.1 * atk + (0.5 * atk + 1.5 * str) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Moulinet à l'épée
            case 2:
              skillFormula = function (atk) {
                return floorMultiplication(
                  3 * atk + (0.8 * atk + 5 * str + 3 * dex + vit) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Accélération
            case 5:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2 * atk + (atk + dex * 3 + str * 7 + vit) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Volonté de vivre
            case 6:
              skillFormula = function (atk) {
                return floorMultiplication(
                  (3 * atk + (atk + 1.5 * str) * skillPower) * 1.07,
                  1
                );
              };
              break;
            case 9:
              skillFormula = function (atk) {
                return floorMultiplication(
                  3 * atk +
                    (0.9 * atk + 500.5 + 5 * str + 3 * dex + lv) * skillPower,
                  1
                );
              };
              break;
          }
        } else if (attackerClass === "mental") {
          switch (skillId) {
            // Attaque de l'esprit
            case 1:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2.3 * atk + (4 * atk + 4 * str + vit) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Attaque de la paume
            case 2:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2.3 * atk + (3 * atk + 4 * str + 3 * vit) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Charge
            case 3:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2 * atk + (2 * atk + 2 * dex + 2 * vit + 4 * str) * skillPower,
                  1
                );
              };
              break;
            // Coup d'épée
            case 5:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2 * atk + (atk + 3 * dex + 5 * str + vit) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Orbe de l'épée
            case 6:
              skillFormula = function (atk) {
                return floorMultiplication(
                  (2 * atk +
                    (2 * atk + 2 * dex + 2 * vit + 4 * str) * skillPower) *
                    1.1,
                  1
                );
              };
              break;
            // Tremblement de terre
            case 9:
              skillFormula = function (atk) {
                return floorMultiplication(
                  3 * atk +
                    (0.9 * atk + 500.5 + 5 * str + 3 * dex + lv) * skillPower,
                  1
                );
              };
              break;
          }
        } else if (attackerClass === "blade_fight") {
          switch (skillId) {
            // Embuscade
            case 1:
              skillFormula = function (atk) {
                return floorMultiplication(
                  atk + (1.2 * atk + 600 + 4 * dex + 4 * str) * skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [1, 50];
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Attaque rapide
            case 2:
              skillFormula = function (atk) {
                return floorMultiplication(
                  atk + (1.6 * atk + 250 + 7 * dex + 7 * str) * skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [1, 35];
              improvedByBonus = true;
              break;
            // Dague filante
            case 3:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2 * atk + (0.5 * atk + 9 * dex + 7 * str) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Brume empoisonnée
            case 5:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2 * lv + (atk + 3 * str + 18 * dex) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Poison insidieux
            case 6:
              skillFormula = function (atk) {
                return floorMultiplication(
                  (2 * lv + (atk + 3 * str + 18 * dex) * skillPower) * 1.1,
                  1
                );
              };
              break;
            // Étoiles brillantes
            case 9:
              skillFormula = function (atk) {
                return floorMultiplication(
                  atk + (1.7 * atk + 500.5 + 6 * dex + 5 * lv) * skillPower,
                  1
                );
              };
              break;
          }
        } else if (attackerClass === "archery") {
          switch (skillId) {
            // Tir à répétition
            // case 1:
            //   skillFormula = function (atk) {
            //     return floorMultiplication(
            //       atk + 0.2 * atk * Math.floor(2 + 6 * skillPower) + (0.8 * atk + 8 * dex * attackFactor + 2 * int) * skillPower,
            //       1
            //     );
            //   };
            //   improvedByBonus = true;
            //   break;
            // Pluie de flèches
            case 2:
              skillFormula = function (atk) {
                return floorMultiplication(
                  atk + (1.7 * atk + 5 * dex + str) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Flèche de feu
            case 3:
              skillFormula = function (atk) {
                return floorMultiplication(
                  1.5 * atk + (2.6 * atk + 0.9 * int + 200) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Foulée de plume
            case 4:
              skillFormula = function (atk) {
                return floorMultiplication(
                  (3 * dex + 200 + 2 * str + 2 * int) * skillPower,
                  1
                );
              };
              skillInfo.removeWeaponReduction = true;
              break;
            // Flèche empoisonnée
            case 5:
              skillFormula = function (atk) {
                return floorMultiplication(
                  atk +
                    (1.4 * atk + 150 + 7 * dex + 4 * str + 4 * int) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Coup étincelant
            case 6:
              skillFormula = function (atk) {
                return floorMultiplication(
                  (atk +
                    (1.2 * atk + 150 + 6 * dex + 3 * str + 3 * int) *
                      skillPower) *
                    1.2,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Tir tempête
            case 9:
              skillFormula = function (atk) {
                return floorMultiplication(
                  1.9 * atk + (2.6 * atk + 500.5) * skillPower,
                  1
                );
              };
              break;
          }
        } else if (attackerClass === "weaponary") {
          switch (skillId) {
            // Toucher brûlant
            case 1:
              skillFormula = function (atk) {
                return floorMultiplication(
                  atk +
                    2 * lv +
                    2 * int +
                    (2 * atk + 4 * str + 14 * int) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Tourbillon du dragon
            case 2:
              skillFormula = function (atk) {
                return floorMultiplication(
                  1.1 * atk +
                    2 * lv +
                    2 * int +
                    (1.5 * atk + str + 12 * int) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
            // Contre-sort
            case 6:
              skillFormula = function (mav) {
                return floorMultiplication(
                  40 +
                    5 * lv +
                    2 * int +
                    (10 * int + 7 * mav + 75) * attackFactor * skillPower,
                  1
                );
              };
              break;
            // Coup démoniaque
            case 9:
              skillFormula = function (atk) {
                return floorMultiplication(
                  1.9 * atk + (2.6 * atk + 500.5) * skillPower,
                  1
                );
              };
              break;
          }
        } else if (attackerClass === "black_magic") {
          switch (skillId) {
            // Attaque des ténèbres
            case 1:
              skillFormula = function (mav) {
                return floorMultiplication(
                  40 +
                    5 * lv +
                    2 * int +
                    (13 * int + 6 * mav + 75) * attackFactor * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Attaque de flammes
            // case 2:
            //   skillFormula = function (mav) {
            //     return floorMultiplication(
            //       5 * lv + 2 * int + (7 * int + 8 * mav + 4 * str + 2 * vit + 190) * skillPower,
            //       1
            //     );
            //   };
            //   improvedByBonus = true;
            //   break;
            // Esprit de flammes
            case 3:
              skillFormula = function (mav) {
                return floorMultiplication(
                  30 +
                    2 * lv +
                    2 * int +
                    (7 * int + 6 * mav + 350) * attackFactor * skillPower,
                  1
                );
              };
              break;
            // Frappe de l'esprit
            // case 5:
            //   skillFormula = function (mav) {
            //     return floorMultiplication(
            //       40 + 2 * lv + 2 * int + (2 * vit + 2 * dex + 13 * int + 6 * mav + 190) * attackFactor * skillPower,
            //       1
            //     );
            //   };
            //   break;
            // Orbe des ténèbres
            case 6:
              skillFormula = function (mav) {
                return floorMultiplication(
                  120 +
                    6 * lv +
                    (5 * vit + 5 * dex + 29 * int + 9 * mav) *
                      attackFactor *
                      skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
          }
        } else if (attackerClass === "dragon") {
          switch (skillId) {
            // Talisman volant
            case 1:
              skillFormula = function (mav) {
                return floorMultiplication(
                  70 +
                    5 * lv +
                    (18 * int + 7 * str + 5 * mav + 50) *
                      attackFactor *
                      skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [4, 10];
              improvedByBonus = true;
              break;
            // Dragon chassant
            case 2:
              skillFormula = function (mav) {
                return floorMultiplication(
                  60 +
                    5 * lv +
                    (16 * int + 6 * dex + 6 * mav + 120) *
                      attackFactor *
                      skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [4, 10];
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Rugissement du dragon
            case 3:
              skillFormula = function (mav) {
                return floorMultiplication(
                  70 +
                    3 * lv +
                    (20 * int + 3 * str + 10 * mav + 100) *
                      attackFactor *
                      skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [4, 10];
              improvedByBonus = true;
              break;
          }
        } else if (attackerClass === "heal") {
          switch (skillId) {
            // Jet de foudre
            case 1:
              skillFormula = function (mav) {
                return floorMultiplication(
                  60 +
                    5 * lv +
                    (8 * int + 2 * dex + 8 * mav + 10 * int) *
                      attackFactor *
                      skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [6, 10];
              improvedByBonus = true;
              break;
            // Invocation de foudre
            case 2:
              skillFormula = function (mav) {
                return floorMultiplication(
                  40 +
                    4 * lv +
                    (13 * int + 2 * str + 10 * mav + 10.5 * int) *
                      attackFactor *
                      skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [6, 10];
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Griffe de foudre
            case 3:
              skillFormula = function (mav) {
                return floorMultiplication(
                  50 +
                    5 * lv +
                    (8 * int + 2 * str + 8 * mav + 400.5) *
                      attackFactor *
                      skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
          }
        } else if (attackerClass === "lycan") {
          switch (skillId) {
            // Déchiqueter
            // case 1:
            //   skillFormula = function (atk) {
            //     return floorMultiplication(
            //       1.1 * atk + (0.3 * atk + 1.5 * str) * skillPower,
            //       1
            //     );
            //   };
            //   skillInfo.weaponBonus = [5, 54];
            //   improvedByBonus = true;
            //   break;
            // Souffle de loup
            case 2:
              skillFormula = function (atk) {
                return floorMultiplication(
                  2 * atk + (atk + 3 * dex + 5 * str + vit) * skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [5, 35];
              improvedByBonus = true;
              improvedBySkillBonus = true;
              break;
            // Bond de loup
            case 3:
              skillFormula = function (atk) {
                return floorMultiplication(
                  atk + (1.6 * atk + 200 + 7 * dex + 7 * str) * skillPower,
                  1
                );
              };
              skillInfo.weaponBonus = [5, 35];
              improvedByBonus = true;
              break;
            // Griffe de loup
            case 4:
              skillFormula = function (atk) {
                return floorMultiplication(
                  3 * atk + (0.8 * atk + 6 * str + 2 * dex + vit) * skillPower,
                  1
                );
              };
              improvedByBonus = true;
              break;
          }
        }
        if (improvedBySkillBonus) {
          skillInfo.skillBonus =
            16 * getSkillPower(attacker.skillBonus, skillPowerTable);

          var skillWardChoice = victim.skillWardChoice;

          if (skillWardChoice && skillWardChoice === attackerClass) {
            skillInfo.skillWard =
              24 * getSkillPower(victim.skillWard, skillPowerTable);
          }
        }

        if (improvedByBonus) {
          skillInfo.skillBonusByBonus = attacker["skillBonus" + skillId];
        }
      } else {
        var skillPower = getSkillPower(
          attacker["horseSkill" + skillId],
          skillPowerTable
        );

        switch (skillId) {
          // Combat équestre
          case 137:
            skillFormula = function (atk) {
              return floorMultiplication(atk + 2 * atk * skillPower, 1);
            };
            break;
          // Charge à cheval
          case 138:
            skillFormula = function (atk) {
              return floorMultiplication(
                2.4 * (200 + 1.5 * lv) + 600 * skillPower,
                1
              );
            };
            break;
          // Vague de Pouvoir
          case 139:
            skillFormula = function (atk) {
              return floorMultiplication(
                2 * (200 + 1.5 * lv) + 600 * skillPower,
                1
              );
            };
            break;
          // Grêle de flèches
          case 140:
            skillFormula = function (atk) {
              return floorMultiplication(atk + 2 * atk * skillPower, 1);
            };
            break;
        }
      }

      return [skillFormula, skillInfo];
    }

    function calcPhysicalSkillDamages(
      attacker,
      attackerWeapon,
      victim,
      tableResult,
      mapping,
      constants,
      damagesChart,
      numberFormat,
      skillId
    ) {
      var battleValues = createSkillBattleValues(
        attacker,
        attackerWeapon,
        victim,
        mapping,
        constants.marriageTable
      );

      var attackFactor = calcAttackFactor(attacker, victim);
      var mainAttackValue = calcMainAttackValue(attacker, attackerWeapon);
      var [
        minAttackValue,
        maxAttackValue,
        attackValueOther,
        minInterval,
        totalCardinal,
      ] = calcSecondaryAttackValue(attacker, attackerWeapon);

      var lastWeightsLimit = maxAttackValue - minInterval + 1;
      var firstWeightLimit = minAttackValue + minInterval - 1;

      var [skillFormula, skillInfo] = getSkillFormula(
        constants.skillPowerTable,
        skillId,
        attacker,
        attackFactor,
        victim
      );

      updateBattleValues(battleValues, skillInfo, attackerWeapon);

      var damagesWeightedByType = {};

      for (var damagesType of battleValues.damagesTypeCombinaison) {
        if (!damagesType.weight) {
          continue;
        }

        var damagesWeighted = {};
        damagesWeightedByType[damagesType.name] = damagesWeighted;

        for (
          var attackValue = minAttackValue;
          attackValue <= maxAttackValue;
          attackValue++
        ) {
          var weight;

          if (attackValue > lastWeightsLimit) {
            weight = maxAttackValue - attackValue + 1;
          } else if (attackValue < firstWeightLimit) {
            weight = attackValue - minAttackValue + 1;
          } else {
            weight = minInterval;
          }

          var secondaryAttackValue = 2 * attackValue + attackValueOther;
          var rawDamages =
            mainAttackValue +
            floorMultiplication(attackFactor, secondaryAttackValue);

          var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
            rawDamages,
            battleValues
          );

          if (damagesWithPrimaryBonuses <= 2) {
            for (var damages = 1; damages <= 5; damages++) {
              damages *= battleValues.useDamages;

              var damagesWithFormula = skillFormula(damages);

              damagesWithFormula = floorMultiplication(
                damagesWithFormula,
                battleValues.weaponBonusCoeff
              );

              var finalDamages = calcSkillDamageWithSecondaryBonuses(
                damagesWithFormula,
                battleValues,
                damagesType,
                damagesWithPrimaryBonuses
              );

              addKeyValue(
                damagesWeighted,
                finalDamages,
                (weight * damagesType.weight) / 5
              );
            }
          } else {
            damagesWithPrimaryBonuses *= battleValues.useDamages;

            var damagesWithFormula = skillFormula(damagesWithPrimaryBonuses);

            damagesWithFormula = floorMultiplication(
              damagesWithFormula,
              battleValues.weaponBonusCoeff
            );

            var finalDamages = calcSkillDamageWithSecondaryBonuses(
              damagesWithFormula,
              battleValues,
              damagesType,
              damagesWithPrimaryBonuses
            );

            addKeyValue(
              damagesWeighted,
              finalDamages,
              weight * damagesType.weight
            );
          }
        }
      }

      return {
        damagesWeightedByType: damagesWeightedByType,
        totalCardinal: totalCardinal,
      };
    }

    function calcMagicSkillDamages(
      attacker,
      attackerWeapon,
      victim,
      tableResult,
      mapping,
      constants,
      damagesChart,
      numberFormat,
      skillId
    ) {
      var battleValues = createSkillBattleValues(
        attacker,
        attackerWeapon,
        victim,
        mapping,
        constants.marriageTable,
        true
      );

      var attackFactor = calcAttackFactor(attacker, victim);
      var [minMagicAttackValue, maxMagicAttackValue, minInterval, totalCardinal] =
        calcMagicAttackValue(attacker, attackerWeapon);

      var lastWeightsLimit = maxMagicAttackValue - minInterval + 1;
      var firstWeightLimit = minMagicAttackValue + minInterval - 1;

      var [skillFormula, skillInfo] = getSkillFormula(
        constants.skillPowerTable,
        skillId,
        attacker,
        attackFactor,
        victim
      );

      updateBattleValues(battleValues, skillInfo, attackerWeapon);

      var damagesWeightedByType = {};

      for (var damagesType of battleValues.damagesTypeCombinaison) {
        if (!damagesType.weight) {
          continue;
        }

        var damagesWeighted = {};
        damagesWeightedByType[damagesType.name] = damagesWeighted;

        for (
          var magicAttackValue = minMagicAttackValue;
          magicAttackValue <= maxMagicAttackValue;
          magicAttackValue++
        ) {
          var weight;

          if (magicAttackValue > lastWeightsLimit) {
            weight = maxMagicAttackValue - magicAttackValue + 1;
          } else if (magicAttackValue < firstWeightLimit) {
            weight = magicAttackValue - minMagicAttackValue + 1;
          } else {
            weight = minInterval;
          }

          var rawDamages = skillFormula(magicAttackValue);

          rawDamages = floorMultiplication(
            rawDamages,
            battleValues.weaponBonusCoeff
          );

          var damagesWithPrimaryBonuses = calcDamageWithPrimaryBonuses(
            rawDamages,
            battleValues
          );

          if (damagesWithPrimaryBonuses <= 2) {
            for (var damages = 1; damages <= 5; damages++) {
              var finalDamages = calcSkillDamageWithSecondaryBonuses(
                damages,
                battleValues,
                damagesType,
                damagesWithPrimaryBonuses,
                skillFormula
              );

              addKeyValue(
                damagesWeighted,
                finalDamages,
                (weight * damagesType.weight) / 5
              );
            }
          } else {
            var finalDamages = calcSkillDamageWithSecondaryBonuses(
              damagesWithPrimaryBonuses,
              battleValues,
              damagesType,
              damagesWithPrimaryBonuses,
              skillFormula
            );

            addKeyValue(
              damagesWeighted,
              finalDamages,
              weight * damagesType.weight
            );
          }
        }
      }

      return {
        damagesWeightedByType: damagesWeightedByType,
        totalCardinal: totalCardinal,
      };
    }

    function calcDamages(attacker, victim, attackType, battle) {
      var damagesCalculator;
      var skillId = 0;

      var attackerWeapon = null;

      if (isPC(attacker)) {
        if (weaponData.hasOwnProperty(attacker.weapon)) {
          attackerWeapon = weaponData[attacker.weapon];
        } else {
          attackerWeapon = weaponData[0];
        }
      }

      if (attackType === "physical") {
        damagesCalculator = calcPhysicalDamages;
      } else if (attackType.startsWith("attackSkill")) {
        skillId = Number(attackType.split("attackSkill")[1]);

        if (isMagicClass(attacker) || isDispell(attacker, skillId)) {
          damagesCalculator = calcMagicSkillDamages;
        } else {
          damagesCalculator = calcPhysicalSkillDamages;
        }
      } else if (attackType.startsWith("horseSkill")) {
        skillId = Number(attackType.split("horseSkill")[1]);
        damagesCalculator = calcPhysicalSkillDamages;
      }

      var damagesWeightedByType = damagesCalculator(
        attacker,
        attackerWeapon,
        victim,
        battle.tableResult,
        battle.mapping,
        battle.constants,
        battle.damagesChart,
        battle.numberFormat,
        skillId
      );

      return damagesWeightedByType;
    }

    return calcDamages(attacker, victim, attackType, battle);
  }

  const WARRIOR = "warrior",
    NINJA = "ninja",
    SURA = "sura",
    SHAMAN = "shaman",
    LYCAN = "lycan",
    BODY = "body",
    MENTAL = "mental",
    BLACK_MAGIC = "black_magic",
    WEAPONARY = "weaponary",
    BLADE_FIGHT = "blade_fight",
    ARCHERY = "archery",
    DRAGON = "dragon",
    HEAL = "heal",
    LYCAN_CLASS = "lycan",
    NORMAL = "normal",
    HORSE = "horse",
    POLYMORPH = "polymorph",
    POLYMORPH_MONSTER_101 = 101,
    POLYMORPH_MONSTER_502 = 502,
    POLYMORPH_MONSTER_2001 = 2001,
    POLYMORPH_MONSTER_2051 = 2051,
    UNCHECKED = "",
    CHECKED = "on",
    NEUTRAL = "neutral",
    AGGRESSIVE = "aggressive",
    FRAUDULENT = "fraudulent",
    MALICIOUS = "malicious",
    CRUEL = "cruel",
    NO_WARD = 0,
    BODY_WARD = "body",
    MENTAL_WARD = "mental",
    BLADE_FIGHT_WARD = "blade_fight",
    ARCHERY_WARD = "archery",
    WEAPONARY_WARD = "weaponary",
    BLACK_MAGIC_WARD = "black_magic",
    DRAGON_WARD = "dragon",
    HEAL_WARD = "heal",
    LYCAN_WARD = "lycan",
    ATTACK_SKILL_1 = "attackSkill1",
    ATTACK_SKILL_2 = "attackSkill2",
    ATTACK_SKILL_3 = "attackSkill3",
    ATTACK_SKILL_4 = "attackSkill4",
    ATTACK_SKILL_5 = "attackSkill5",
    ATTACK_SKILL_6 = "attackSkill6",
    ATTACK_SKILL_9 = "attackSkill9",
    HORSE_SKILL_137 = "horseSkill137",
    HORSE_SKILL_138 = "horseSkill138",
    HORSE_SKILL_139 = "horseSkill139",
    HORSE_SKILL_140 = "horseSkill140";

  function createRange(min, max) {
    const range = [];

    for (let value = min; value <= max; value++) {
      range.push(value);
    }

    return range;
  }

  const RANGE_5 = createRange(0, 5),
    RANGE_10 = createRange(0, 10),
    RANGE_20 = createRange(0, 20),
    RANGE_40 = createRange(0, 40),
    RANGE_50 = createRange(0, 50),
    RANGE_100 = createRange(0, 100),
    RANGE_200 = createRange(0, 200),
    RANGE_300 = createRange(1, 200),
    RANGE_400 = createRange(0, 400),
    RANGE_500 = createRange(0, 500),
    RANGE_2000 = createRange(0, 2000);

  const ALLOWED_VALUES = {
    race: [WARRIOR, NINJA, SURA, SHAMAN, LYCAN],
    level: createRange(1, 120),
    state: [NORMAL, HORSE, POLYMORPH],
    polymorphMonster: [
      POLYMORPH_MONSTER_101,
      POLYMORPH_MONSTER_502,
      POLYMORPH_MONSTER_2001,
      POLYMORPH_MONSTER_2051,
    ],
    vit: RANGE_300,
    int: RANGE_300,
    str: RANGE_300,
    dex: RANGE_300,
    defense: createRange(0, 5000),
    magicDefense: createRange(0, 3000),
    attackSpeed: RANGE_300,
    sungmaStr: RANGE_500,
    sungmaStrMalus: RANGE_100,
    minAttackValueRandom: RANGE_2000,
    maxAttackValueRandom: RANGE_2000,
    minMagicAttackValueRandom: RANGE_2000,
    maxMagicAttackValueRandom: RANGE_2000,
    minAttackValueSlash: RANGE_500,
    maxAttackValueSlash: RANGE_500,
    minMagicAttackValueSlash: RANGE_200,
    maxMagicAttackValueSlash: RANGE_200,
    stoneBonus: RANGE_200,
    humanBonus: RANGE_200,
    humanResistance: RANGE_100,
    orcBonus: RANGE_500,
    undeadBonus: RANGE_500,
    monsterBonus: RANGE_200,
    zodiacBonus: RANGE_100,
    monsterResistance: RANGE_50,
    animalBonus: RANGE_500,
    mysticBonus: RANGE_500,
    devilBonus: RANGE_500,
    desertBonus: RANGE_500,
    insectBonus: RANGE_500,
    attackValuePercent: RANGE_400,
    attackValue: createRange(0, 6000),
    defensePercent: RANGE_100,
    defenseUseless: RANGE_100,
    averageDamage: createRange(-55, 200),
    averageDamageResistance: RANGE_200,
    skillDamage: createRange(-27, 200),
    skillDamageResistance: RANGE_200,
    attackMeleeMagic: RANGE_200,
    attackMagic: RANGE_200,
    magicAttackValue: RANGE_200,
    criticalHit: RANGE_200,
    piercingHit: RANGE_200,
    criticalHitResistance: RANGE_50,
    piercingHitResistance: RANGE_50,
    magicResistance: RANGE_200,
    antiMagic: RANGE_200,
    lightningResistance: RANGE_400,
    fireResistance: RANGE_400,
    iceResistance: RANGE_400,
    windResistance: RANGE_400,
    earthResistance: RANGE_400,
    darknessResistance: RANGE_400,
    lightningBonus: RANGE_400,
    fireBonus: RANGE_400,
    iceBonus: RANGE_400,
    windBonus: RANGE_400,
    earthBonus: RANGE_400,
    darknessBonus: RANGE_400,
    warriorBonus: RANGE_200,
    ninjaBonus: RANGE_200,
    suraBonus: RANGE_200,
    shamanBonus: RANGE_200,
    lycanBonus: RANGE_200,
    warriorResistance: RANGE_200,
    ninjaResistance: RANGE_200,
    suraResistance: RANGE_200,
    shamanResistance: RANGE_200,
    lycanResistance: RANGE_200,
    swordDefense: RANGE_100,
    twoHandedSwordDefense: RANGE_100,
    daggerDefense: RANGE_100,
    clawDefense: RANGE_100,
    bellDefense: RANGE_100,
    fanDefense: RANGE_100,
    arrowDefense: RANGE_100,
    breakSwordDefense: RANGE_10,
    breakTwoHandedSwordDefense: RANGE_10,
    breakDaggerDefense: RANGE_10,
    breakBellDefense: RANGE_10,
    breakFanDefense: RANGE_10,
    breakArrowDefense: RANGE_10,
    breakClawDefense: RANGE_10,
    meleeBlock: RANGE_200,
    arrowBlock: RANGE_200,
    precision: RANGE_200,
    leadership: RANGE_100,
    bossDamage: RANGE_20,
    skillBossDamage: RANGE_20,
    damageBonus: RANGE_10,
    meleeArrowBlock: RANGE_10,
    biologist70: [UNCHECKED, CHECKED],
    empireMalus: [UNCHECKED, CHECKED],
    tigerStrength: [UNCHECKED, CHECKED],
    whiteDragonElixir: [UNCHECKED, CHECKED],
    steelDragonElixir: [UNCHECKED, CHECKED],
    lowRank: [UNCHECKED, CHECKED],
    playerRank: [NEUTRAL, AGGRESSIVE, FRAUDULENT, MALICIOUS, CRUEL],
    attackSkill1: RANGE_40,
    attackSkill2: RANGE_40,
    attackSkill3: RANGE_40,
    attackSkill4: RANGE_40,
    attackSkill5: RANGE_40,
    attackSkill6: RANGE_40,
    attackSkill9: RANGE_40,
    skillBlessing: [UNCHECKED, CHECKED],
    intBlessing: RANGE_300,
    dexBlessing: RANGE_300,
    blessingOnself: [UNCHECKED, CHECKED],
    skillWardChoice: [
      NO_WARD,
      BODY_WARD,
      MENTAL_WARD,
      BLADE_FIGHT_WARD,
      ARCHERY_WARD,
      WEAPONARY_WARD,
      BLACK_MAGIC_WARD,
      DRAGON_WARD,
      HEAL_WARD,
      LYCAN_WARD,
    ],
    skillWard: RANGE_40,
    skillBonus: RANGE_40,
    polymorphPoint: RANGE_40,
    horsePoint: RANGE_40,
    horseSkill137: RANGE_20,
    horseSkill138: RANGE_20,
    horseSkill139: RANGE_20,
    horseSkill140: RANGE_20,
    skillBonus1: RANGE_5,
    skillBonus2: RANGE_5,
    skillBonus3: RANGE_5,
    skillBonus4: RANGE_5,
    skillBonus5: RANGE_5,
    skillBonus6: RANGE_5,
    isMarried: [UNCHECKED, CHECKED],
    lovePoint: createRange(50, 100),
    harmonyBracelet: [UNCHECKED, CHECKED],
    loveNecklace: [UNCHECKED, CHECKED],
    harmonyNecklace: [UNCHECKED, CHECKED],
    loveEarrings: [UNCHECKED, CHECKED],
    harmonyEarrings: [UNCHECKED, CHECKED],
  };

  const CLASS_VALUES = {
    warrior: [BODY, MENTAL],
    sura: [BLACK_MAGIC, WEAPONARY],
    ninja: [BLADE_FIGHT, ARCHERY],
    shaman: [DRAGON, HEAL],
    lycan: [LYCAN_CLASS],
  };

  const ALLOWED_SKILLS = {
    body: [1, 2, 5, 6],
    mental: [1, 2, 5, 6],
    blade_fight: [3, 5, 6],
    archery: [2, 4],
    weaponary: [1, 2],
    black_magic: [6],
    dragon: [1, 2, 3],
    heal: [],
    lycan: [2, 3, 4],
  };

  const ALLOWED_HORSE_SKILLS = {
    body: [137, 138, 139],
    mental: [137, 138, 139],
    blade_fight: [137, 138, 139, 140],
    archery: [137, 138, 139, 140],
    weaponary: [137, 138, 139],
    black_magic: [137, 138, 139],
    dragon: [137, 138, 139],
    heal: [137, 138, 139],
    lycan: [137, 138, 139],
  };

  const SKILL_MAPPING = {
    1: ATTACK_SKILL_1,
    2: ATTACK_SKILL_2,
    3: ATTACK_SKILL_3,
    4: ATTACK_SKILL_4,
    5: ATTACK_SKILL_5,
    6: ATTACK_SKILL_6,
    9: ATTACK_SKILL_9,
    137: HORSE_SKILL_137,
    138: HORSE_SKILL_138,
    139: HORSE_SKILL_139,
    140: HORSE_SKILL_140,
  };

  const ALLOWED_WEAPONS = {
    warrior: [0, 3, 8],
    ninja: [0, 1, 2, 8],
    sura: [0, 7, 8],
    shaman: [4, 6, 8],
    lycan: [5, 8],
  };

  function getAllMonsters() {
    const monsters = [];
    const monstersNoStones = [];

    for (const [key, value] of Object.entries(monsterData)) {
      if (value[1] === 0) {
        monstersNoStones.push(key);
      }
      monsters.push(key);
    }

    return [monsters, monstersNoStones];
  }

  const [MONSTERS, MONSTERS_NO_STONES] = getAllMonsters();

  function getWeaponsToUse(race) {
    const weaponsToUse = {};

    for (const [key, value] of Object.entries(weaponData)) {
      if (ALLOWED_WEAPONS[race].includes(value[0])) {
        weaponsToUse[key] = value[2].length;
      }
    }

    return weaponsToUse;
  }

  const WEAPONS_TO_USE = {
    warrior: getWeaponsToUse("warrior"),
    sura: getWeaponsToUse("sura"),
    ninja: getWeaponsToUse("ninja"),
    shaman: getWeaponsToUse("shaman"),
    lycan: getWeaponsToUse("lycan"),
  };

  function randomChoiceWeighted(arr) {
    const weights = Array.from(arr, (_, idx) => arr.length - idx);
    const sum = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * sum;
    let index = weights.length - 1;

    for (let i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        index = i;
        break;
      } else {
        random -= weights[i];
      }
    }

    return arr[index];
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createRandomCharacter(index) {
    const character = { name: `random_char_${index}` };

    for (const [key, value] of Object.entries(ALLOWED_VALUES)) {
      let chosenValue;

      if (value[0] === 0 || value[0] === 1) {
        chosenValue = randomChoiceWeighted(value);
      } else {
        chosenValue = randomChoice(value);
      }
      character[key] = chosenValue;
    }

    const characterRace = character.race;
    const weapons = WEAPONS_TO_USE[characterRace];
    let weaponVnum = randomChoice(Object.keys(weapons));

    const excludeWeapons = [
        140,
        150,
        190,
        200,
        250,
        270,
        280,
        320,
        340,
        500,
        1190,
        1500,
        2160,
        2210,
        2500,
        3230,
        3500,
        4040,
        5090,
        5170,
        5330,
        5500,
        6130,
        6500,
        7130,
        7190,
        7310,
        7500
    ];  
    
    if (excludeWeapons.includes(Number(weaponVnum))) {
      weaponVnum = 0;
    }
    const maxUpgrade = weapons[weaponVnum];

    character.class = randomChoice(CLASS_VALUES[characterRace]);
    character.weapon = Number(weaponVnum);
    character.weaponUpgrade = randomChoice(createRange(0, maxUpgrade - 1));

    return character;
  }

  function main() {
    const battle = { mapping: createMapping(), constants: createConstants() };
    let charIndex = 0;

    for (let index = 0; index < 1000; index++) {
      let attacker, victim, attackType;

      if (Math.random() >= 0.3) {
        attacker = createRandomCharacter(charIndex);
        charIndex++;

        if (attacker.state === "polymorph") {
          attackType = "physical";
        } else {
          const attackerClass = attacker.class;
          let skillsToUse = [...ALLOWED_SKILLS[attackerClass]];

          if (attacker.state === "horse") {
            skillsToUse = skillsToUse.concat(ALLOWED_HORSE_SKILLS[attackerClass]);
          }

          skillsToUse = skillsToUse
            .filter((skill) => attacker[SKILL_MAPPING[skill]])
            .map((skill) => SKILL_MAPPING[skill]);
          attackType = randomChoice(["physical"].concat(skillsToUse));
        }
      } else {
        attacker = createMonster(randomChoice(MONSTERS_NO_STONES));
        attackType = "physical";
      }

      if (Math.random() >= 0.5) {
        victim = createRandomCharacter(charIndex);
        charIndex++;
      } else {
        victim = createMonster(randomChoice(MONSTERS));
      }

      attacker.magicAttackValue = 0;
      victim.magicResistance = 0;
      attacker.attackMagic = 0;
      attacker.attackMeleeMagic = 0;

      if (attacker.state === "horse") {
        attacker.isRiding = "on";
      } else if (attacker.state === "polymorph") {
        attacker.isPolymorph = "on";
      }

      if (victim.state === "horse") {
        victim.isRiding = "on";
      } else if (victim.state === "polymorph") {
        victim.isPolymorph = "on";
      }

      const {
        damagesWeightedByType: damagesWeightedByTypeReference,
        totalCardinal: totalCardinalReference,
      } = referenceCalculation(
        { ...attacker },
        { ...victim },
        attackType,
        battle
      );

      damagesWeightedByTypeReference.totalCardinal = totalCardinalReference;

      const { damagesWeightedByType, totalCardinal } = calcDamages(
        { ...attacker },
        { ...victim },
        attackType,
        battle
      );

      damagesWeightedByType.totalCardinal = totalCardinal;

      if (
        JSON.stringify(damagesWeightedByType) !==
        JSON.stringify(damagesWeightedByTypeReference)
      ) {
        console.log("Error. A difference appeared in the results");
        console.log(attacker);
        console.log(victim);
        console.log(attackType);
        console.log(JSON.parse(JSON.stringify(damagesWeightedByType)));
        console.log(JSON.parse(JSON.stringify(damagesWeightedByTypeReference)));

        if (isPC(attacker)) {
          downloadData(
            JSON.stringify(attacker),
            "text/plain",
            attacker.name + ".txt"
          );
        }

        if (isPC(victim)) {
          downloadData(
            JSON.stringify(victim),
            "text/plain",
            victim.name + ".txt"
          );
        }

        break;
      } else {
        console.log("Success! The simulations generated the same results");
      }
    }
  }

  main();
