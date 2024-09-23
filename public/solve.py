import sys
import json
from fractions import Fraction

# Función auxiliar para convertir entrada a fracción o decimal
def parse_input(value):
    try:
        # Intentar convertir a fracción si es del tipo "1/8"
        return Fraction(value)
    except ValueError:
        # Si no, intentar convertir a float
        return float(value)

# Leer los argumentos desde la línea de comandos y convertir a fracción o float
x1, y1, z1, x2, y2, z2 = map(parse_input, sys.argv[1:7])

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
step1.append(f"D = ( x1*y2 ) - ( x2*y1 ) ")
step1.append(f"D = ( {x1}*{y2} ) - ( {x2}*{y1} ) ")
step1.append(f"D = {D}")

# Calcular los determinantes Dx y Dy
Dx = z1 * y2 - z2 * y1
Dy = x1 * z2 - x2 * z1
step2.append(f"Determinante Dx")
step2.append(f"Dx = ( z1*y2 ) -( z2*y1 )")
step2.append(f"Dx = ( {z1}*{y2} ) - ( {z2}*{y1} )")
step2.append(f"Dx = {Dx}")

step3.append(f"Determinante Dy")
step3.append(f"Dy = ( x1*z2 ) - ( x2*z1 )")
step3.append(f"Dy = ( {x1}*{z2} ) - ( {x2}*{z1} )")
step3.append(f"Dy = {Dy}")

# Intentar resolver el sistema usando la regla de Cramer
try:
    if D == 0:
        raise ValueError("El determinante principal es 0. El sistema no tiene solución única.")
    
    # Calcular las soluciones
    x = Dx / D
    y = Dy / D

    # Convertir los resultados a fracciones, si es posible
    x_fraction = Fraction(x).limit_denominator()
    y_fraction = Fraction(y).limit_denominator()

    # Si la fracción es un número entero, mostrarlo como entero
    if x_fraction.denominator == 1:
        x_fraction = int(x_fraction)
    if y_fraction.denominator == 1:
        y_fraction = int(y_fraction)

    strx = 'x = ' + str(x_fraction)
    stry = 'y = ' + str(y_fraction)   
    # Añadir los pasos de la solución
    step4.append(f"Solución: x ")
    step4.append(f"x = ( Dx ) / ( D ) ")
    step4.append(f"x = ( {Dx} ) / ( {D} )")
    step4.append(f"x = {x_fraction}")

    step5.append(f"Solución: y")
    step5.append(f"y = ( Dy ) / ( D )")
    step5.append(f"y = ( {Dy} ) / ( {D} )")
    step5.append(f"y = {y_fraction}")

    # Crear un diccionario con el resultado y los pasos
    result = {
        "x": strx,
        "y": stry,
        "step1": step1,
        "step2": step2,
        "step3": step3,
        "step4": step4,
        "step5": step5
    }
    
    # Devolver los resultados y los pasos como JSON
    print(json.dumps(result))

except ValueError as e:
    steps.append(str(e))
    result = {
        "error": str(e),
        "step1": step1,
        "step2": step2,
        "step3": step3,
        "step4": step4,
        "step5": step5
    }
    print(json.dumps(result))
