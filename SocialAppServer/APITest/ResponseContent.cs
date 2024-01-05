using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Azure;
using Neo4j.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SocialAppServer.Models;

namespace APITest
{
    public static class ResponseContent
    {
        public static JObject GetValidationContent(HttpResponseMessage response)
        {
            return JObject.Parse(response.Content.ReadAsStringAsync().Result);
        }

        public static void ShowResponseContent(HttpResponseMessage response)
        {
            JObject responseContent = GetValidationContent(response);
            foreach (var error in responseContent["errors"])
            {
                Trace.WriteLine(error.ToString());
            }
        }

        public static T GetResponseObject<T>(HttpResponseMessage response)
        {
            var content = response.Content.ReadFromJsonAsync<T>().Result;
            return content;
        }

        public static string GetResponseMessage(HttpResponseMessage response)
        {
            var message = response.Content.ReadAsStringAsync().Result;
            return message;
        }
    }
}
