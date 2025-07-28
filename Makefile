# Variaveis
# Define a pasta de destino para os builds dos submódulos
TARGET_FOLDER := ./public/modules
# Define o arquivo principal do projeto
SERVER=src/server.js
# Define a pasta onde serão salvos os dados
DATA=data

# Alvo principal para construir todos os submódulos
.PHONY: build_submodules
help:
	@echo help
	@echo run
	@echo build_submodules
	@echo clear_modules
	@echo clear_data

run:
	@node $(SERVER)
	@mkdir -p $(DATA)

build_submodules:
	@echo "==============================================="
	@echo "Iniciando o build dos submódulos do Git..."
	@echo "==============================================="

	@if ! command -v make &> /dev/null; then \
		echo "Erro: O comando 'make' não foi encontrado. Por favor, instale 'make' para continuar."; \
		exit 1; \
	fi

	
	@git submodule foreach ' \
		if [ -f "Makefile" ]; then \
			echo "  Entrando em: $$PWD"; \
			mkdir "../../$(TARGET_FOLDER)/$$(basename $$PWD)"; \
			make build OUT_DIR="../../$(TARGET_FOLDER)/$$(basename $$PWD)"; \
			MAKE_STATUS=$$?; \
			if [ $$MAKE_STATUS -ne 0 ]; then \
				echo "  Erro ao construir o submódulo $$(basename "$$PWD"). Código de saída: $$MAKE_STATUS"; \
				exit $$MAKE_STATUS; \
			else \
				echo "  Build do submódulo $$(basename "$$PWD") concluído com sucesso."; \
			fi; \
		else \
			echo "  Aviso: Makefile não encontrado em $$(basename "$$PWD"). Pulando o build para este submódulo."; \
		fi; \
		echo "-----------------------------------------------"; \
		'
	@echo "==============================================="
	@echo "Processo de build dos submódulos concluído."
	@echo "==============================================="

clear_modules:
	@git submodule foreach 'make clear'
	@rm -rf $(TARGET_FOLDER)/*

clear_data:
	@rm -rf ./src/data/*