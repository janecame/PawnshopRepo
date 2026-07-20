using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SCPWEBAPI.FldrClass
{

    public class Clsaddvalue
    {
        private string m_Display;
        private string m_Value;

        public Clsaddvalue(string Display, string Value)
        {
            m_Display = Display;
            m_Value = Value;
        }

        public string Display
        {
            get { return m_Display; }
        }

        public string Value
        {
            get { return m_Value; }
        }
    }
}
