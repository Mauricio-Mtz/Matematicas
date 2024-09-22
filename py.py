import sys
import json
from fractions import Fraction

# Leer los argumentos desde la línea de comandos
x1, y1, z1, x2, y2, z2 = map(float, sys.argv[1:7])

# Guardar los pasos en una lista
steps = []
step1 = []
step2 = []
step3 = []
step4 = []
step5 = []

# Calcular el determinante principal (D)
D = x1 * y2 - x2 * y1
step1.append(f"Determinante principal (D)")
step1.append(f"= x1*y2 - x2*y1")
step1.append(f"= {x1}*{y2} - {x2}*{y1}")
step1.append(f"= {D}")

# Calcular los determinantes Dx y Dy
Dx = z1 * y2 - z2 * y1
Dy = x1 * z2 - x2 * z1
step2.append(f"Determinante Dx")
step2.append(f"= z1*y2 - z2*y1 ")
step2.append(f"= {z1}*{y2} - {z2}*{y1} = {Dx}")
step2.append(f"= {Dx}")

step3.append(f"Determinante Dy ")
step3.append(f"= x1*z2 - x2*z1")
step3.append(f"= {x1}*{z2} - {x2}*{z1}")
step3.append(f"= {Dy}")

# Intentar resolver el sistema usando la regla de Cramer
try:
    if D == 0:
        raise ValueError("El determinante principal es 0. El sistema no tiene solución única.")
    
    # Calcular las soluciones
    x = Dx / D
    y = Dy / D

    # Convertir los resultados a fracciones
    x_fraction = Fraction(x).limit_denominator()
    y_fraction = Fraction(y).limit_denominator()

    strx = 'X = ' + str(x_fraction)
    stry = 'Y = ' + str(y_fraction)   
    # Añadir los pasos de la solución
    step4.append(f"Solución: x ")
    step4.append(f"= Dx / D ")
    step4.append(f"= {Dx} / {D}")
    step4.append(f"= {x_fraction}")

    step5.append(f"Solución: y")
    step5.append(f"= Dy / D ")
    step5.append(f"= {Dy} / {D} ")
    step5.append(f"= {y_fraction}")

    # Crear un diccionario con el resultado y los pasos
    result = {
        "x": strx,
        "y": stry,
        "step1":step1,
        "step2":step2,
        "step3":step3,
        "step4":step4,
        "step5":step5
    }
    
    # Devolver los resultados y los pasos como JSON
    print(json.dumps(result))

except ValueError as e:
    steps.append(str(e))
    result = {
        "error": str(e),
        "steps": steps
    }
    print(json.dumps(result))
