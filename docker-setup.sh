#!/bin/bash

if [ -z "$WZ_HOME" ]; then
    echo -e "${RED}WZ_HOME is not set. Please ensure it is defined in the environment.${NC}"
    exit 1
fi

DEV_SH_PATH="$(pwd)/docker/osd-dev"
echo "DEV_SH_PATH: $DEV_SH_PATH"
echo "WZ_HOME: $WZ_HOME"


GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

function start() {
    echo -e "${GREEN}Starting Docker containers...${NC}"
    cd "$DEV_SH_PATH"
    chmod +x dev.sh
    bash dev.sh "$WZ_HOME" up
    echo -e "${GREEN}Docker containers started successfully.${NC}"
    docker exec -it os-dev-2130-osd-1 yarn start --no-base-path
}


function stop() {
    echo -e "${YELLOW}Stopping Docker containers...${NC}"
    cd "$DEV_SH_PATH"
    chmod +x dev.sh
    bash ./dev.sh "$WZ_HOME" down
    echo -e "${GREEN}Docker containers stopped successfully.${NC}"
}


function cleanup() {
    local images_to_remove=(
        "imposter"
        "filebeat"
        "os1"
        "generator"
        "osd"
        "quay.io/prometheuscommunity/elasticsearch-exporter"
        "opensearchproject/opensearch"
        "cfssl/cfssl"
    )

    local networks_to_remove=(
        "mon"
        "devel"
    )

    echo -e "${YELLOW}Starting selective Docker cleanup process...${NC}"

    echo -e "${YELLOW}Stopping and removing containers for specified images...${NC}"
    stop

    echo -e "${YELLOW}Removing specified Docker images...${NC}"
    for image in "${images_to_remove[@]}"; do
        docker images | grep "$image" | awk '{print $3}' | xargs -r docker rmi -f
    done

    echo -e "${YELLOW}Removing specified Docker networks...${NC}"
    for network in "${networks_to_remove[@]}"; do
        docker network inspect "$network" > /dev/null 2>&1 && docker network rm "$network"
    done

    echo -e "${YELLOW}Removing Grafana Loki plugin...${NC}"
    docker plugin ls --filter "name=loki" -q | xargs -r docker plugin rm -f

    echo -e "${GREEN}Selective Docker cleanup completed successfully.${NC}"

    echo -e "\n${YELLOW}Removed Images:${NC}"
    for image in "${images_to_remove[@]}"; do
        echo "Removed images containing: $image"
    done

    echo -e "\n${YELLOW}Removed Networks:${NC}"
    for network in "${networks_to_remove[@]}"; do
        echo "Removed network: $network"
    done
}


error_handler() {
    echo -e "${RED}An error occurred during Docker cleanup.${NC}"
    echo -e "${RED}Error: $?${NC}"
}

function restart() {
    stop
    start
}

function main() {
    trap error_handler ERR
    task="$1"
    
    case "$task" in
        "stop")
            stop
            ;;
        "run")
            start
            ;;
        "restart")
            restart
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            echo "Invalid task. Please use: stop, run, restart, or cleanup"
            exit 1
            ;;
    esac
}

main "$@"

