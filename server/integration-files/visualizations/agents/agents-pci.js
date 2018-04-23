/*
 * Wazuh app - Module for Agents/PCI visualizations
 * Copyright (C) 2018 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

module.exports = [{
        "_id": "Wazuh-App-Agents-PCI-Requirements",
        "_source": {
            "title": "Wazuh App Agents PCI Requirements",
            "visState": "{\"title\":\"Wazuh App Agents PCI Requirements\",\"type\":\"histogram\",\"params\":{\"type\":\"histogram\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"histogram\",\"mode\":\"stacked\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"rule.pci_dss\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"\"}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"rule.pci_dss\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"PCI DSS Requirements\"}}]}",
            "uiStateJSON": "{}",
            "description": "",
            "version": 1,
            "kibanaSavedObjectMeta": {
                "searchSourceJSON": "{\"index\":\"wazuh-alerts\",\"filter\":[],\"query\":{\"query\":\"_exists_:rule.pci_dss\",\"language\":\"lucene\"}}"
            }
        },
        "_type": "visualization"
    },
    {
        "_id": "Wazuh-App-Agents-PCI-Groups",
        "_source": {
            "title": "Wazuh App Agents PCI Groups",
            "visState": "{\"title\":\"Wazuh App Agents PCI Groups\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":true},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"rule.groups\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}]}",
            "uiStateJSON": "{}",
            "description": "",
            "version": 1,
            "kibanaSavedObjectMeta": {
                "searchSourceJSON": "{\"index\":\"wazuh-alerts\",\"filter\":[],\"query\":{\"query\":\"_exists_:rule.pci_dss\",\"language\":\"lucene\"}}"
            }
        },
        "_type": "visualization"
    },
    {
        "_id": "Wazuh-App-Agents-PCI-Last-alerts",
        "_type": "visualization",
        "_source": {
            "title": "Wazuh App Agents PCI Last alerts",
            "visState": "{\"title\":\"Wazuh App Agents PCI Last alerts\",\"type\":\"table\",\"params\":{\"perPage\":10,\"showPartialRows\":false,\"showMeticsAtAllLevels\":false,\"sort\":{\"columnIndex\":2,\"direction\":\"asc\"},\"showTotal\":false,\"totalFunc\":\"sum\"},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"rule.pci_dss\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"size\":50,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Requirement\"}},{\"id\":\"4\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"bucket\",\"params\":{\"field\":\"rule.description\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\",\"size\":10,\"order\":\"desc\",\"orderBy\":\"1\",\"customLabel\":\"Rule description\"}}]}",
            "uiStateJSON": "{\"vis\":{\"params\":{\"sort\":{\"columnIndex\":2,\"direction\":\"desc\"}}}}",
            "description": "",
            "version": 1,
            "kibanaSavedObjectMeta": {
                "searchSourceJSON": "{\"index\":\"wazuh-alerts\",\"filter\":[],\"query\":{\"query\":\"_exists_:rule.pci_dss\",\"language\":\"lucene\"}}"
            }
        }
    }
]
