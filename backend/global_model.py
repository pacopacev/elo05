from datetime import datetime



class GlobalModel:

    @staticmethod
    def currentYear():
        current_year = datetime.now().year
        return current_year