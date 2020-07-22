/*
 * Wazuh app - React component for building Remoted dashboard
 *
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, {  useEffect, useState } from "react";
import { EuiFlexGroup, EuiFlexItem, EuiPanel } from "@elastic/eui";
import WzReduxProvider from "../../../../../redux/wz-redux-provider";
import KibanaVis from "../../../../../kibana-integrations/kibana-vis";
import { TabVisualizations } from "../../../../../factories/tab-visualizations";
import { LoadedVisualizations } from "../../../../../factories/loaded-visualizations";
import { DiscoverPendingUpdates } from "../../../../../factories/discover-pending-updates";
import { RawVisualizations } from "../../../../../factories/raw-visualizations";
import { GenericRequest } from "../../../../../react-services/generic-request";
import store from "../../../../../redux/store";
import { updateVis } from "../../../../../redux/actions/visualizationsActions";
import { AppState } from "../../../../../react-services/app-state";



export function WzStatisticsRemoted({clusterNodeSelected}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const tabVisualizations = new TabVisualizations();
    const rawVisualizations = new RawVisualizations();
    const discoverPendingUpdates = new DiscoverPendingUpdates();
    const loadedVisualizations = new LoadedVisualizations();
    discoverPendingUpdates.removeAll();
    rawVisualizations.removeAll();
    tabVisualizations.removeAll();
    loadedVisualizations.removeAll();
    tabVisualizations.setTab("statistics");
    tabVisualizations.assign({
      statistics: 2,
    });
    const buildStatisticsVisualizations = async () => {
      discoverPendingUpdates.addItem({ query: "", language: "lucene" }, []);
      const visData = await GenericRequest.request(
        "POST",
        `/elastic/visualizations/cluster-statistics/wazuh-statistic*`,
        { nodes: { items: [{}], master_node: JSON.parse(AppState.getCurrentAPI()).id  , name: clusterNodeSelected, } }
      );
      await rawVisualizations.assignItems(visData.data.raw);
      store.dispatch(
        updateVis({ update: true, raw: rawVisualizations.getList() })
      );
      setLoaded(true);
    };
    buildStatisticsVisualizations();
  }, []);
  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Total number of bytes received</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <WzReduxProvider>
                    <KibanaVis
                      visID={
                        "Wazuh-App-Statistics-remoted-Recv-bytes"
                      }
                      tab={"statistics"}
                    ></KibanaVis>
                  </WzReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Events sent to Analysisd</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <WzReduxProvider>
                    <KibanaVis
                      visID={
                        "Wazuh-App-Statistics-remoted-event-count"
                      }
                      tab={"statistics"}
                    ></KibanaVis>
                  </WzReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>Messages statistics</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <WzReduxProvider>
                    <KibanaVis
                      visID={
                        "Wazuh-App-Statistics-remoted-messages"
                      }
                      tab={"statistics"}
                    ></KibanaVis>
                  </WzReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel style={{ height: "400px" }}>
            <EuiFlexGroup>
              <EuiFlexItem>TCP sessions</EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup>
              <EuiFlexItem>
                <div style={{ height: "365px" }}>
                  <WzReduxProvider>
                    <KibanaVis
                      visID={
                        "Wazuh-App-Statistics-remoted-tcp-sessions"
                      }
                      tab={"statistics"}
                    ></KibanaVis>
                  </WzReduxProvider>
                </div>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}
